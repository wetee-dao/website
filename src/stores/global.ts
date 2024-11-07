import { defineStore } from 'pinia'

export const useBreadcrumbStore = defineStore('breadcrumb', {
  state: () => ({
    paths: [] as any[],
  }), actions: {
    setPaths(paths: any[]) {
      this.paths = paths
    }
  },
})
