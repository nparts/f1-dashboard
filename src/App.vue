<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script lang="ts" setup>
  //
</script>
<style>
@font-face{
    font-family: "Formula1-Regular";
    font-weight: normal;
    src:local("Formula1-Regular"),
    url('./assets/fonts/Formula1/Formula1-Regular.ttf') 
}
@font-face{
    font-family: "Formula1-Bold";
    font-weight: Bold;
    src:local("Formula1-Bold"),
    url('./assets/fonts/Formula1/Formula1-Bold.ttf') 
}
@font-face{
    font-family: "Formula1-Wide";
    font-weight: bolder;
    src:local("Formula1-Wide"),
    url('./assets/fonts/Formula1/Formula1-Wide.ttf') 
}
</style>