<template>
  <div>
    <img id="save_img" :src="imgSrc" alt="" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      imgSrc: ""
    };
  },

  components: {},

  computed: {},

  mounted() {
    this.imgSrc = window.localStorage.getItem("faceImage");
    let user =JSON.parse(window.localStorage.getItem('user'))
    console.log(user)
    // this.getFaceData()
    this.$axios.post("faceIdentify/addFace", {image:this.imgSrc.replace(/^data:image\/\w+;base64,/, ''),user_id:user.id,user_info:'新增人脸'
    }).then(res => {
      console.log('token',res.data)
    })
  },

  methods: {
  }
};
</script>
<style lang="scss" scoped></style>
