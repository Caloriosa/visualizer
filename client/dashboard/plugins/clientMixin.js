import DTO from '@caloriosa/rest-dto'

export default {
    install(_Vue) {
        _Vue.mixin({beforeCreate() {
            this.$client = new DTO.Client({
                url: "/agw"
            });
            this.$api = {
                users: new DTO.UserService(this.$client)
            }
          }
        });
    }
}