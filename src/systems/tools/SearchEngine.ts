import { useGameStore } from '@/store/gameStore';
import { searchDatabase } from '@/data/search-results';

export class SearchEngine {
  search(query: string): void {
    const state = useGameStore.getState();
    const results = searchDatabase(query);
    state.setSearchQuery(query);
    state.setSearchResults(results);

    // Cost some network resources
    state.adjustResource('network', 5);
  }
}
