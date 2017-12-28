<template>
  <div id="app" class="container">
  <h2>{{ msg }}</h2>
  <div class="row">
    <div class="col">
      <div v-if="featuredSensor" class="card stat-card bg-success">
        <div class="card-body">
          <span class="title">{{ featuredSensor.value }}</span>
          <span class="subtitle">{{ featuredSensor.title }}</span>
        </div>
        <div class="card-icon">
          <i class="fa fa-thermometer-three-quarters" aria-hidden="true"></i>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card stat-card bg-danger">
        <div class="card-body">
          <span class="title">{{ devicesCount }}</span>
          <span class="subtitle">Devices</span>
        </div>
        <div class="card-icon">
          <i class="fa fa-microchip" aria-hidden="true"></i>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card stat-card bg-warning">
        <div class="card-body">
          <span class="title">{{ measuredValues }}</span>
          <span class="subtitle">values</span>
        </div>
        <div class="card-icon">
          <i class="fa fa-line-chart" aria-hidden="true"></i>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card stat-card bg-secondary">
        <div class="card-body">
          <span class="title">3</span>
          <span class="subtitle">Messages</span>
        </div>
        <div class="card-icon">
          <i class="fa fa-inbox " aria-hidden="true"></i>
        </div>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col">
      1 of 2
    </div>
    <div class="col">
      2 of 2
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'dashboard',
  data () {
    return {
      msg: 'Welcome to Dashboard',
      featuredSensor: null,
      devicesCount: 4,
      measuredValues: 3675
    }
  },
  async created() {
      let response = await fetch("/payload/featured");
      let data = await response.json();
      this.featuredSensor = data.featuredSensor;
  }
}
</script>

<style lang="scss" scoped>

</style>
