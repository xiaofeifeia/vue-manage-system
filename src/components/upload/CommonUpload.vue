<template>
    <div class="uploadForm">
        <ul>
            <li v-for="(item,index) in fileList" :key="index">
                <el-image :src="item"></el-image>
                <div class="opr">
                    <span v-if="index===fileIndex">商品主图</span>
                    <a
                        href="javascript:void(0);"
                        v-if="index!==fileIndex"
                        @click="setFirst(index)"
                    >设置主图</a>
                    <a href="javascript:void(0);" @click="deleteImages(index)">删除图片</a>
                </div>
            </li>
        </ul>
        <div class="uploadShow">
            <div label="上传图片" class="el-form-item el-form-item--small">
                <label class="el-form-item__label">上传图片</label>
                <el-upload
                    action="http://localhost:8874/upload"
                    :on-success="handleUploadSuccess"
                    :before-upload="handleUploadBefore"
                    :show-file-list="false"
                    list-type="picture"
                    :limit="limitSize"
                >
                    <el-button size="small" type="primary">点击上传</el-button>
                    <p class="el-upload__tip">只能上传jpg/png文件，且不超过1M</p>
                </el-upload>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'commonUpload',
    data() {
        return {
            limitSize: 5,
            fileList: this.imageList,
            fileIndex: this.imageIndex
        };
    },

    props: {
        imageList: {
            type: Array,
            default: []
        },
        imageIndex: {
            type: Number,
            default: 0
        }
    },
    watch: {
        imageList(val) {
            this.fileList = val;
        },
        imageIndex(val) {
            this.fileIndex = val;
        }
    },
    created() {},
    methods: {
        handleUploadSuccess(res) {
            this.fileList = [
                ...this.fileList,
                'https://m.360buyimg.com/mobilecms/s720x720_jfs/t22861/8/2449951226/155000/42b9bdd5/5b7fd79cN2223f4a5.jpg!q70.jpg.webp'
            ];

            this.$emit('get-files', this.fileList, this.fileIndex); //向父组件传递图片数组
            //后台返回数据
            // if (res.code === 200) {
            //     this.fileList.push(res.data);
            //     this.brandForm.image = res.data.url;
            //     this.$emit('getFiles'.this.fileList); //向父组件传递图片数组
            //     this.$message.success('上传成功');
            // } else {
            //     this.$message.error('上传失败');
            // }
        },
        handleUploadBefore(file) {
            if (this.imageList.length >= this.limitSize) {
                this.$message.error('只能上传5张图片');
                return true;
            }

            const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
            const isLt1M = file.size / 1024 / 1024 < 1;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG,PNG 格式!');
                return false;
            }
            if (!isLt1M) {
                this.$message.error('上传头像图片大小不能超过 1MB!');
                return false;
            }
            return true;
        },
        setFirst(index) {
            this.fileIndex = index;
        },
        deleteImages(index) {
            if (this.fileList.length > 0) {
                this.fileList.splice(index, 1);
            }
            if (this.fileList.length < this.fileIndex + 1) {
                this.fileIndex = this.fileList.length - 1;
            }
        }
    }
};
</script>

<style scoped>
* {
    font-size: 12px;
}
.uploadForm {
    border: 1px solid #dcdfe6;
    border-radius: 3px;
    background-color: #f5f7fa;
}

ul > li {
    width: 140px;
    border: 1px solid #dcdfe6;
    margin: 10px 0 10px 10px;
    list-style: none;
    float: left;
}
ul > li > .el-image {
    height: 120px;
    width: 140px;
}
ul > li > .opr {
    height: 30px;
    border-top: 1px solid #dcdfe6;
    line-height: 30px;
    text-align: center;
}

ul > li > .opr > a {
    padding: 0 10px;
}
ul > li > .opr > a:nth-child(2) {
    color: tomato;
}
.uploadShow {
    clear: both;
    padding-top: 20px;
    border-top: 1px solid #dcdfe6;
}
.uploadShow .el-form-item__label {
    width: 150px;
}
.uploadShow .el-upload__tip {
    color: #999999;
}
</style>
