
import { create } from 'zustand';
import type { GeneratedCode, Commit, CodeFile } from '../types';
import { generateAppCode, enhanceAppCode, generateFollowUpSuggestions } from '../services/geminiService';

// --- STATE ---
interface AppState {
  prompt: string;
  enhancementPrompt: string;
  generatedCode: GeneratedCode | null;
  commits: Commit[];
  selectedCommitId: string | null;
  activeFile: string | null;
  isLoading: boolean;
  error: string | null;
  followUpSuggestions: string[];
}

// --- ACTIONS ---
interface AppActions {
  setPrompt: (prompt: string) => void;
  setEnhancementPrompt: (prompt: string) => void;
  setActiveFile: (fileName: string) => void;
  setError: (error: string | null) => void;
  
  generateCode: () => Promise<void>;
  enhanceCode: (enhancementPrompt: string) => Promise<void>;
  
  commitChanges: (message: string) => void;
  selectCommit: (commitId: string | null) => void;

  retry: () => void;
}

// --- INITIAL STATE ---
const initialState: AppState = {
  prompt: '',
  enhancementPrompt: '',
  generatedCode: null,
  commits: [],
  selectedCommitId: null,
  activeFile: null,
  isLoading: false,
  error: null,
  followUpSuggestions: [],
};

// --- STORE ---
export const useAppStore = create<AppState & AppActions>((set, get) => ({
  ...initialState,

  // --- SETTERS ---
  setPrompt: (prompt) => set({ prompt }),
  setEnhancementPrompt: (prompt) => set({ enhancementPrompt: prompt }),
  setActiveFile: (fileName) => set({ activeFile: fileName }),
  setError: (error) => set({ error }),
  
  // --- ASYNC ACTIONS ---
  generateCode: async () => {
    const prompt = get().prompt;
    if (!prompt.trim()) {
      set({ error: 'Please enter an app idea.' });
      return;
    }

    set({ 
      isLoading: true, 
      error: null, 
      generatedCode: null, 
      activeFile: null,
      selectedCommitId: null,
      followUpSuggestions: [],
    });

    try {
      const result = await generateAppCode(prompt);
      set({
        generatedCode: result,
        activeFile: result.files?.[0]?.name ?? null,
      });
      // Get follow-up suggestions non-blockingly
      try {
        const suggestions = await generateFollowUpSuggestions(prompt, result);
        set({ followUpSuggestions: suggestions });
      } catch (suggestionError) {
        console.warn("Could not generate follow-up suggestions:", suggestionError);
      }
    } catch (err) {
      console.error(err);
      set({ error: 'Failed to generate code. The model may be unavailable or the request was filtered. Please try a different prompt.' });
    } finally {
      set({ isLoading: false });
    }
  },

  enhanceCode: async (enhancementPrompt) => {
    const { generatedCode } = get();
    if (!enhancementPrompt.trim()) {
      set({ error: 'Please describe the enhancement you want to make.' });
      return;
    }
    if (!generatedCode) {
      set({ error: 'Cannot perform enhancement without existing code.' });
      return;
    }

    set({ isLoading: true, error: null, followUpSuggestions: [] });
    
    try {
      const result = await enhanceAppCode(generatedCode, enhancementPrompt);
      const currentActiveFile = get().activeFile;
      const activeFileExists = result.files.some(f => f.name === currentActiveFile);

      set({
        generatedCode: result,
        activeFile: activeFileExists ? currentActiveFile : result.files?.[0]?.name ?? null,
        enhancementPrompt: '', // Clear input on success
      });

      // Get new suggestions
      try {
        const suggestions = await generateFollowUpSuggestions(enhancementPrompt, result);
        set({ followUpSuggestions: suggestions });
      } catch (suggestionError) {
        console.warn("Could not generate follow-up suggestions after enhancement:", suggestionError);
      }
    } catch (err) {
      console.error(err);
      set({ error: 'Failed to apply enhancement. The model may be unavailable or the request was filtered. Please try again.' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  // --- SYNC ACTIONS ---
  commitChanges: (message) => {
    const { generatedCode } = get();
    if (!generatedCode) return;

    const newCommit: Commit = {
      id: `commit-${Date.now()}`,
      message,
      code: generatedCode,
      createdAt: new Date().toISOString(),
    };

    set(state => ({
      commits: [...state.commits, newCommit]
    }));
  },

  selectCommit: (commitId) => {
    const { commits, generatedCode } = get();
    set({ selectedCommitId: commitId });

    if (commitId) {
        const commit = commits.find(c => c.id === commitId);
        if (commit?.code.files.length) {
            set({ activeFile: commit.code.files[0].name });
        }
    } else if (generatedCode?.files.length) {
        set({ activeFile: generatedCode.files[0].name });
    }
  },

  retry: () => {
      set({ error: null });
      get().generateCode();
  }

}));

// --- SELECTOR ---
export const useDisplayCode = () => useAppStore(state => {
    const { generatedCode, commits, selectedCommitId } = state;
    const selectedCommit = commits.find(c => c.id === selectedCommitId);
    return selectedCommit ? selectedCommit.code : generatedCode;
});
