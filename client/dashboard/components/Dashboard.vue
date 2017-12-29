<template>
    <div id="dashboard" class="container mt-4">
        <div v-if="loaded">
            <h2>Welcome, {{ user.name ? user.name : user.login }}</h2>
            <div class="row mt-4">
                <div class="col">
                1 of 2
                </div>
                <div class="col-12 col-md-4 stat-cards-slot">
                <div class="card stat-card" v-bind:class="sensorTypeTranslate('color')" style="">
                    <div class="card-body">
                    <span class="title" v-text="featuredSensor.value"></span>
                    <span class="subtitle" v-text="featuredSensor.title"></span>
                    </div>
                    <div class="card-icon">
                    <i :class="sensorTypeTranslate('icon')" :title="sensorTypeTranslate('title')" aria-hidden="true"></i>
                    </div>
                </div>
                <div class="card stat-card bg-info">
                    <div class="card-body">
                    <span class="title">4</span>
                    <span class="subtitle">Devices</span>
                    </div>
                    <div class="card-icon">
                    <i class="fa fa-microchip" aria-hidden="true"></i>
                    </div>
                </div>
                </div>
            </div>
        </div>
        <div v-else-if="error" class="alert alert-danger">
            <b>An error occured:</b> {{ error }}
        </div>
        <div v-else>
            <div class="loading text-center mt-4 mb-4">
                <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
                <span class="sr-only">Loading...</span>
            </div>
        </div>
    </div>
</template>

<script>
import { UserService } from '@caloriosa/rest-dto'

export default {
  name: 'dashboard',
  data () {
    return {
      userService: null,
      loaded: false,
      error: null,
      user: {
          name: "Anonymous"
      },
      featuredSensor: {
          value: "0",
          title: "Sensor",
          type: "TEMPERATURE"
      },
      devicesCount: 0,
      measuredValues: 0
    }
  },
  methods: {
      sensorTypeTranslate(what) {
          let icons = {
            'TEMPERATURE': {
                icon: "fa fa-thermometer-three-quarters",
                title: "Temperature",
                color: "bg-success"
            },
            'HUMIDITY': {
                icon: "fa fa-tint",
                title: "Humidity",
                color: "bg-primary"
            },
            'WIND_SPEED': {
                icon: "fa fa-flag",
                title: "Wind speed",
                color: "bg-info"
            }
          }
          return icons[this.featuredSensor.type][what];
      },
      fetchData() {
        this.$api.users.fetchMe().then(me => {
            this.user = me;
        }).catch(err => {
            this.error = err.message;
        });
      }
  },
  created() {
  },
  mounted() {
      this.fetchData();
  }
}
</script>

<style lang="scss" scoped>

</style>
