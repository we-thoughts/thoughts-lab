<template name="mobius-tagbar">
  <view class="mobius-tagbar" :style="tagbarComputedStyleStr">
    <view
      id="mobius_tagbar_allbtn"
      v-if="type === 'multi'"
      class="mobius-tagbar__tag"
      :class="allbtn_selected? 'mobius-tagbar__tag--selected_yes' : ''"
      @click="__allBtnClick"
    >全部</view>
    <view
      v-for="(tag, index) in tags"
      :key="tag"
      class="mobius-tagbar__tag"
      :class="selected_tags.includes(tag) ? 'mobius-tagbar__tag--selected_yes' : ''"
      :data-tagname="tag"
      @click="__tagClick"
    >{{tag}}</view>
  </view>
</template>

<script>
export default {
  name: "mobius-tagbar",
  props: {
    show: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: "single"
    },
    tags: {
      type: Array,
      default: []
    },
    selected: {
      type: [String, Array],
      default: []
    }
  },
  data() {
    return {
      allbtn_selected: false,
      selected_tags: [],
      rect: {}
    };
  },
  watch: {
    selected(tags) {
      this._initTags();
    },
    selected_tags(tags, oldtags) {
      this.allbtn_selected =
        this.$utils.Array.difference(this.tags, tags).length === 0;
      if (tags.length !== oldtags.length) {
        this.$emit("tagsChange", {
          selected_tags: [].concat(this.selected_tags)
        });
      }
    }
  },
  computed: {
    tagbarComputedStyleStr() {
      return `
        height: ${this.show ? this.rect.height : 0}px;
        padding-top: ${this.show ? this.rect.tagbar_padding_y : 0}px;
        padding-bottom: ${this.show ? this.rect.tagbar_padding_y : 0}px;
        padding-left: ${this.rect.tagbar_padding_x}px;
        padding-right: ${this.rect.tagbar_padding_x}px;
      `;
    }
  },
  created() {},
  async mounted() {
    // 计算布局信息
    await this._calculateSize();
  },
  methods: {
    __allBtnClick(e) {
      this.selected_tags = this.allbtn_selected ? [] : [...this.tags];
    },
    __tagClick(e) {
      let _tags = new Set(this.selected_tags);
      let { tagname } = e.currentTarget.dataset;
      if (this.type === "multi") {
        _tags.has(tagname) ? _tags.delete(tagname) : _tags.add(tagname);
        this.selected_tags = [..._tags];
      }
      if (this.type === "single") {
        this.selected_tags = [tagname];
      }
    },
    _initTags() {
      let tagarr = [];
      if (typeof this.selected === "string") tagarr.push(this.selected);
      if (Array.isArray(this.selected)) tagarr.push(...this.selected);
      this.selected_tags = this.$utils.Array.intersection(this.tags, tagarr);
    },
    async _calculateSize() {
      let { windowWidth, statusBarHeight } = uni.getSystemInfoSync();
      let { top, right } = uni.getMenuButtonBoundingClientRect();
      let rect = {
        tagbar_padding_y: top - statusBarHeight,
        tagbar_padding_x: windowWidth - right
      };
      await new Promise((resolve, reject) => {
        uni
          .createSelectorQuery()
          .in(this)
          .select("#mobius_tagbar_allbtn")
          .boundingClientRect(data => {
            rect["height"] = rect.tagbar_padding_y * 2 + data.height;
            resolve();
          })
          .exec();
      });
      this.rect = rect;
    }
  }
};
</script>

<style>
</style>
