<template>
  <goods-detail :is-edit="false" />
</template>

<script>
import GoodsDetail from './components/GoodsDetail'

export default {
  name: 'CreateForm',
  components: { GoodsDetail }
}
</script>

