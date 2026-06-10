import { ref, onMounted, onUnmounted } from 'vue';
import { supabase } from '../lib/supabase.js';

// Global state (shared across all components that import this)
const user = ref(null);
const loading = ref(true);

export function useAuth() {
  let subscription = null;

  onMounted(async () => {
    // Get current session on mount
    const { data } = await supabase.auth.getSession();
    user.value = data.session?.user ?? null;
    loading.value = false;

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null;
    });
    subscription = listener?.subscription;
  });

  // Cleanup must be registered during setup (not inside onMounted)
  onUnmounted(() => {
    subscription?.unsubscribe();
  });

  async function signOut() {
    await supabase.auth.signOut();
    user.value = null;
  }

  return { user, loading, signOut };
}

