<script lang="ts">
export default {
  data() {
    return {
      selectedFile: null,
    };
  },
  methods: {
    handleFileUpload(event) {
      this.selectedFile = event.target.files[0];
    },
    async uploadFile() {
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      try {
        await this.$axios.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        alert('File uploaded successfully');
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  }
};
</script>

<template>
  <div>
    <input type="file" @change="handleFileUpload"/>
    <button @click="uploadFile">Upload</button>
  </div>
</template>

<style scoped>

</style>