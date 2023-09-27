<template>
  <div
    class="main-menu menu-fixed menu-accordion menu-shadow max-h-100vh"
    :class="[
      { 'expanded': !isVerticalMenuCollapsed || (isVerticalMenuCollapsed && isMouseHovered) },
      skin === 'dark' ? 'menu-dark' : 'menu-light'
    ]"
    @mouseenter="updateMouseHovered(true)"
    @mouseleave="updateMouseHovered(false)"
  >
    <!-- main menu header-->
    <div class="navbar-header">
      <slot
        name="header"
        :toggle-vertical-menu-active="toggleVerticalMenuActive"
        :toggle-collapsed="toggleCollapsed"
        :collapse-toggler-icon="collapseTogglerIcon"
      >
        <ul class="nav navbar-nav flex-row" >

          <!-- Logo & Text -->
          <li class="nav-item mr-auto">
            <b-link
              class="navbar-brand"
              to="/"
            >
                <b-avatar
                variant="dark"
                style="border: 1px solid rgba(255,255,255,0.05);
                box-shadow: 0px 2px 3px 0px rgba(0,0,0,0.3);
                "

                rounded
                 class="brand-logo"
                  :src="appLogoImage"
                  alt="logo"
                />
            <span class="app-name text-shadow-xl"
            style="
            ;
">
<!-- $blue:  !default; //$info -->
<!-- $orange: #F0A04a !default; //$warning -->
<!-- $cyan: #30a09a !default; //$warning -->
                <span class="text-white brand-text
                " style="
                font-weight: 700;
                text-shadow: -1px 1px 8px rgba(255,255,255,0.1);
                ">WISE</span>
  <!--               <span -->
  <!--               class="brand-x" -->
  <!--               style=" -->
  <!--               font-weight: 900; -->
  <!--               text-shadow: 0px -1px 0px rgba(0,0,0,0.1); -->
  <!--                 background: -webkit-linear-gradient(180deg, #F0A04a 0%,#9a67f0 100%); -->
  <!--                   -webkit-background-clip: text; -->
  <!-- -webkit-text-fill-color: transparent; -->
  <!--                 " -->
  <!--               >X</span> -->
                <span
                class="brand-text"
                style="
                font-weight: 200;
                  background: -webkit-linear-gradient(235deg, #9a67f0 0%,#3Ba9DB 100%);
                    -webkit-background-clip: text;
background-clip: text;
  -webkit-text-fill-color: rgba(255,255,255,0.1);
                  "
                >XPLORER</span>
            </span>
            </b-link>
          </li>
          <hr/>

          <!-- Toggler Button -->
          <!-- <li class="nav-item nav-toggle"> -->
          <!--   <b-link class="nav-link modern-nav-toggle"> -->
          <!--     <feather-icon -->
          <!--       icon="XIcon" -->
          <!--       size="20" -->
          <!--       class="d-block d-xl-none" -->
          <!--       @click="toggleVerticalMenuActive" -->
          <!--     /> -->
          <!--     <feather-icon -->
          <!--       :icon="collapseTogglerIconFeather" -->
          <!--       size="20" -->
          <!--       class="d-xl-block collapse-toggle-icon" -->
          <!--     /> -->
          <!--   </b-link> -->
          <!-- </li> -->
        </ul>
      </slot>
    </div>
    <!-- / main menu header-->
    <!-- main menu content-->
    <vue-perfect-scrollbar
      :settings="perfectScrollbarSettings"
      class="main-menu-content scroll-area"

      tagname="ul"
      @ps-scroll-y="evt => { shallShadowBottom = evt.srcElement.scrollTop > 0 }"
    >
      <vertical-nav-menu-items
        :items.sync="navMenuItems"
        class="navigation navigation-main"
      />
    </vue-perfect-scrollbar>
    <!-- /main menu content-->
  </div>
</template>

<script>
import navMenuItems from '@/navigation/vertical'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import {
  BLink,
  BAvatar,
  BBadge,
  BImg,
} from 'bootstrap-vue'
import { provide, computed, ref } from '@vue/composition-api'
import useAppConfig from '@core/app-config/useAppConfig'
import { $themeConfig } from '@themeConfig'
import VerticalNavMenuItems from './components/vertical-nav-menu-items/VerticalNavMenuItems.vue'
import Socials from '../../../../../layouts/components/Socials.vue'
import useVerticalNavMenu from './useVerticalNavMenu'

export default {
  components: {
    VuePerfectScrollbar,
    BAvatar,
    VerticalNavMenuItems,
    BLink,
    BBadge,
    BImg,
    Socials,
  },
  props: {
    isVerticalMenuActive: {
      type: Boolean,
      required: true,
    },
    toggleVerticalMenuActive: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const {
      isMouseHovered,
      isVerticalMenuCollapsed,
      collapseTogglerIcon,
      toggleCollapsed,
      updateMouseHovered,
    } = useVerticalNavMenu(props)

    const { skin } = useAppConfig()

    // Shadow bottom is UI specific and can be removed by user => It's not in `useVerticalNavMenu`
    const shallShadowBottom = ref(true)

    provide('isMouseHovered', isMouseHovered)

    const perfectScrollbarSettings = {
      maxScrollbarLength: 40,
      wheelPropagation: true,
    }

    const collapseTogglerIconFeather = computed(() => (collapseTogglerIcon.value === 'unpinned' ? 'CircleIcon' : 'DiscIcon'))

    // App Name
    const { appName, appLogoImage } = $themeConfig.app

    return {
      navMenuItems,
      perfectScrollbarSettings,
      isVerticalMenuCollapsed,
      collapseTogglerIcon,
      toggleCollapsed,
      isMouseHovered,
      updateMouseHovered,
      collapseTogglerIconFeather,

      // Shadow Bottom
      shallShadowBottom,

      // Skin
      skin,

      // App Name
      appName,
      appLogoImage,
    }
  },
}
</script>

<style lang="scss">
@import "~@core/scss/base/core/menu/menu-types/vertical-menu.scss";
</style>
