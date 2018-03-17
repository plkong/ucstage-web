<template>
    <el-form :inline="true" :model="formInline">

        <el-form-item label="类别">
            <el-select v-model="formInline.id" clearable placeholder="select sex"
                       v-on:visible-change="selectDemo">
                <el-option
                        v-for="item in type_options"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>

        <el-form-item v-if='formInline.id' label="Description">
            <el-input v-model="formInline.email" placeholder="Please input suffix of email"></el-input>
        </el-form-item>

        <el-form-item v-else-if='formInline.id' label="Description">
            <el-input v-model="formInline.email" disabled placeholder="Please input suffix of email"></el-input>
        </el-form-item>

    </el-form>
</template>

<script>
    import lodash from 'lodash'
    import Bus from '../eventBus'

    export default {
       // name: 'db-filterinput',
        data() {
            return {
                type_options: [],
                formInline: {
                    id: '',
                    email: ''
                },
                formLabelWidth: '120px'
            }
        },

        watch: {
            'formInline.id': 'filterResultData',
            'formInline.email': 'filterResultData'
        },

        methods: {
            selectDemo: function (params) {
                let self = this;
                if (params) {
                    this.$axios.get("/api/category/categorys/0")
                        .then((response) => {
                            self.type_options = response.data;
                            console.log(response.data);
                        }).catch(function (response) {
                        console.log(response)
                    });
                }
            },
            filterResultData: _.debounce(
                function () {
                    let id = this.formInline.id;
                    this.$axios.get("/api/category/categorys/" + 0
                    ).then((response) => {
                        Bus.$emit('filterResultData', response);
                        console.log(response);
                    }).catch(function (response) {
                        console.log(response)
                    });
                },
                500
            ),
        }
    }


</script>