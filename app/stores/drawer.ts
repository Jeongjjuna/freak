import { defineStore } from 'pinia'
import type { CategoryGroup, PostMeta } from '~/types/post'

interface DrawerState {
  isOpen: boolean
  groups: CategoryGroup[]
  recentPosts: PostMeta[]
}

export const useDrawerStore = defineStore('drawer', {
  state: (): DrawerState => ({
    isOpen: false,
    groups: [],
    recentPosts: [],
  }),
  actions: {
    open() { this.isOpen = true },
    close() { this.isOpen = false },
    setData(groups: CategoryGroup[], recentPosts: PostMeta[]) {
      this.groups = groups
      this.recentPosts = recentPosts
    },
  },
})
