"use strict";

var _index = require("https://unpkg.com/polymorph-js@0.2.4/lib.es2015/index.js");

var _graph = require("https://cdn.jsdelivr.net/gh/greghub/funnel-graph-js@master/src/js/graph.js");

var _number = require("https://cdn.jsdelivr.net/gh/greghub/funnel-graph-js@master/src/js/number.js");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

console.log('kkkkkkkkkkkkkkkkkkkkkkkk');
var VueFunnelGraph = Vue.component('VueFunnelGraph', {
  name: 'VueFunnelGraph',
  props: {
    animated: {
      type: Boolean,
      "default": false
    },
    width: [String, Number],
    height: [String, Number],
    values: Array,
    labels: Array,
    colors: {
      type: Array,
      "default": function _default() {
        return [];
      }
    },
    subLabels: Array,
    direction: {
      type: String,
      "default": 'horizontal'
    },
    gradientDirection: {
      type: String,
      "default": 'horizontal'
    },
    displayPercentage: {
      type: Boolean,
      "default": true
    }
  },
  data: function data() {
    return {
      paths: [],
      prevPaths: [],
      // paths before update, used for animations
      graph: null,
      tween: null,
      defaultColors: (0, _graph.getDefaultColors)(10)
    };
  },
  computed: {
    valuesFormatted: function valuesFormatted() {
      if (this.graph.is2d()) {
        return this.graph.getValues2d().map(function (value) {
          return (0, _number.formatNumber)(value);
        });
      }

      return this.values.map(function (value) {
        return (0, _number.formatNumber)(value);
      });
    },
    colorSet: function colorSet() {
      var colorSet = [];
      var gradientCount = 0;

      for (var i = 0; i < this.paths.length; i++) {
        var values = this.graph.is2d() ? this.getColors[i] : this.getColors;
        var fillMode = typeof values === 'string' || values.length === 1 ? 'solid' : 'gradient';
        if (fillMode === 'gradient') gradientCount += 1;
        colorSet.push({
          values: values,
          fillMode: fillMode,
          fill: fillMode === 'solid' ? values : "url('#funnelGradient-".concat(gradientCount, "')")
        });
      }

      return colorSet;
    },
    gradientSet: function gradientSet() {
      var gradientSet = [];
      this.colorSet.forEach(function (colors) {
        if (colors.fillMode === 'gradient') {
          gradientSet.push(colors);
        }
      });
      return gradientSet;
    },
    getColors: function getColors() {
      if (this.colors instanceof Array && this.colors.length === 0) {
        return (0, _graph.getDefaultColors)(this.is2d() ? this.values[0].length : 2);
      }

      if (this.colors.length < this.paths.length) {
        return _toConsumableArray(this.colors).concat(_toConsumableArray(this.defaultColors).splice(this.paths.length, this.paths.length - this.colors.length));
      }

      return this.colors;
    },
    gradientAngle: function gradientAngle() {
      return "rotate(".concat(this.gradientDirection === 'vertical' ? 90 : 0, ")");
    }
  },
  methods: {
    enterTransition: function enterTransition(el, done) {
      if (!this.animated) done();
      setTimeout(function () {
        return done();
      }, 700);
    },
    leaveTransition: function leaveTransition(el, done) {
      if (!this.animated) done();
      setTimeout(function () {
        return done();
      }, 700);
    },
    is2d: function is2d() {
      return this.graph.is2d();
    },
    percentages: function percentages() {
      return this.graph.createPercentages();
    },
    twoDimPercentages: function twoDimPercentages() {
      if (!this.is2d()) {
        return [];
      }

      return this.graph.getPercentages2d();
    },
    subLabelBackgrounds: function subLabelBackgrounds(index) {
      if (!this.is2d()) {
        return [];
      }

      return (0, _graph.generateLegendBackground)(this.getColors[index], this.gradientDirection);
    },
    offsetColor: function offsetColor(index, length) {
      return "".concat(Math.round(100 * index / (length - 1)), "%");
    },
    makeAnimations: function makeAnimations() {
      var _this = this;

      if (this.tween !== null) {
        this.tween.stop();
      }

      var interpolators = [];
      var dimensionChanged = this.prevPaths.length !== this.paths.length;
      var origin = {
        x: 0.5,
        y: 0.5
      };

      if (dimensionChanged) {
        origin = {
          x: 0,
          y: 0.5
        };

        if (this.graph.isVertical()) {
          origin = {
            x: 1,
            y: 1
          };
        }

        if (!this.graph.is2d()) {
          origin = {
            x: 0,
            y: 1
          };
        }
      }

      this.paths.forEach(function (path, index) {
        var oldPath = _this.prevPaths[index] || _this.graph.getPathMedian(index);

        if (dimensionChanged) oldPath = _this.graph.getPathMedian(index);
        var interpolator = (0, _index.interpolate)([oldPath, path], {
          addPoints: 1,
          origin: origin,
          optimize: 'fill',
          precision: 1
        });
        interpolators.push(interpolator);
      });

      function animate() {
        if (TWEEN.update()) {
          requestAnimationFrame(animate);
        }
      }

      var position = {
        value: 0
      };
      this.tween = new TWEEN.Tween(position).to({
        value: 1
      }, 700).easing(TWEEN.Easing.Cubic.InOut).onUpdate(function () {
        for (var index = 0; index < _this.paths.length; index++) {
          _this.paths[index] = interpolators[index](position.value); // eslint-disable-next-line no-underscore-dangle

          _this.paths.__ob__.dep.notify();
        }
      });
      this.tween.start();
      animate();
    },
    drawPaths: function drawPaths() {
      var _this2 = this;

      this.prevPaths = this.paths;
      this.paths = [];
      var definitions = this.graph.getPathDefinitions();
      definitions.forEach(function (d) {
        _this2.paths.push(d);
      });
    }
  },
  beforeMount: function beforeMount() {
    this.graph = new FunnelGraph({
      height: this.height,
      width: this.width,
      direction: this.direction,
      data: {
        labels: this.labels,
        values: this.values
      }
    });
    this.drawPaths();
    if (this.animated) this.makeAnimations();
  },
  watch: {
    values: function values() {
      this.graph.setValues(this.values);
      this.drawPaths();
      if (this.animated) this.makeAnimations();
    },
    direction: function direction() {
      this.graph.setDirection(this.direction).setWidth(this.width).setHeight(this.height);
      this.drawPaths();
    }
  },
  template: "<template>\n    <div class=\"funnel svg-funnel-js\" :class=\"{'svg-funnel-js--vertical': direction === 'vertical'}\">\n        <div class=\"svg-funnel-js__container\">\n            <svg :width=\"width\" :height=\"height\">\n                <defs>\n                    <linearGradient :id=\"'funnelGradient-' + (index + 1)\"\n                                    v-for=\"(colors, index) in gradientSet\"\n                                    :key=\"index\"\n                                    :gradientTransform=\"gradientAngle\"\n                    >\n                        <stop :stop-color=\"color\"\n                              :offset=\"offsetColor(index, colors.values.length)\"\n                              v-for=\"(color, index) in colors.values\"\n                              :key=\"index\"\n                        ></stop>\n                    </linearGradient>\n                </defs>\n                <path :fill=\"colorSet[index].fill\" :stroke=\"colorSet[index].fill\"\n                      :d=\"path\" v-for=\"(path, index) in paths\" :key=\"index\"\n                ></path>\n            </svg>\n        </div>\n        <transition-group class=\"svg-funnel-js__labels\" name=\"appear\" tag=\"div\"\n                          v-on:enter=\"enterTransition\" v-on:leave=\"leaveTransition\"\n        >\n            <div class=\"svg-funnel-js__label\" :class=\"'label-' + (index + 1)\"\n                 v-for=\"(value, index) in valuesFormatted\" :key=\"labels[index].toLowerCase().split(' ').join('-')\"\n            >\n                <div class=\"label__value\">{{ value }}</div>\n                <div class=\"label__title\" v-if=\"labels\">{{ labels[index] }}</div>\n                <div class=\"label__percentage\" v-if=\"displayPercentage && percentages()[index] !== 100\">\n                    {{ percentages()[index] }}%\n                </div>\n                <div class=\"label__segment-percentages\" v-if=\"is2d()\">\n                    <ul class=\"segment-percentage__list\">\n                        <li v-for=\"(subLabel, j) in subLabels\" :key=\"j\">\n                            {{ subLabel }}:\n                            <span class=\"percentage__list-label\">{{ twoDimPercentages()[index][j] }}%</span>\n                        </li>\n                    </ul>\n                </div>\n            </div>\n        </transition-group>\n        <transition name=\"fade\" v-on:enter=\"enterTransition\" v-on:leave=\"leaveTransition\">\n            <div class=\"svg-funnel-js__subLabels\" v-if=\"is2d()\">\n                <div :class=\"'svg-funnel-js__subLabel svg-funnel-js__subLabel-' + (index + 1)\"\n                     v-for=\"(subLabel, index) in subLabels\"\n                     :key=\"index\"\n                >\n                    <div class=\"svg-funnel-js__subLabel--color\"\n                         :style=\"subLabelBackgrounds(index)\"></div>\n                    <div class=\"svg-funnel-js__subLabel--title\">{{ subLabel }}</div>\n                </div>\n            </div>\n        </transition>\n    </div>\n</template>\n        "
}); // export default VueFunnelGraph

new Vue({
  el: '#app',
  components: {
    VueFunnelGraph: VueFunnelGraph
  },
  data: function data() {
    return {
      labels: ['Impressions', 'Add To Cart', 'Buy'],
      subLabels: [],
      values: [12000, 5700, 930],
      colors: ['#FFB178', '#FF3C8E'],
      direction: 'horizontal',
      gradientDirection: 'horizontal',
      height: 300,
      width: 800,
      dataSetNum: 1
    };
  },
  methods: {
    useDataSet1: function useDataSet1() {
      this.labels = ['Impressions', 'Add To Cart', 'Buy'];
      this.subLabels = [];
      this.values = [12000, 4700, 930];
      this.colors = ['#FFB178', '#FF3C8E'];
    },
    useDataSet2: function useDataSet2() {
      this.labels = ['Impressions', 'Add To Cart', 'Buy'];
      this.subLabels = [];
      this.values = [14000, 9100, 1230];
      this.colors = ['#A0BBFF', '#EC77FF'];
    },
    useDataSet3: function useDataSet3() {
      this.labels = ['Impressions', 'Add To Cart', 'Buy'];
      this.subLabels = ['Direct', 'Social Media', 'Ads'];
      this.values = [[3000, 2500, 6500], [3000, 1700, 1000], [600, 200, 130]];
      this.colors = [['#FFB178', '#FF78B1', '#FF3C8E'], ['#A0BBFF', '#EC77FF'], ['#A0F9FF', '#7795FF']];
    },
    useDataSet4: function useDataSet4() {
      this.labels = ['Impressions', 'Add To Cart', 'Buy', 'Return'];
      this.subLabels = [];
      this.values = [14000, 9100, 4230, 260];
      this.colors = ['#FF4589', '#FF5050'];
    },
    useDataSet5: function useDataSet5() {
      this.labels = ['Impressions', 'Add To Cart', 'Buy'];
      this.subLabels = [];
      this.values = [12650, 4230, 263];
      this.colors = ['#FF9A9A', '#FFB178'];
    },
    useDataSet6: function useDataSet6() {
      this.labels = ['Impressions', 'Add To Cart', 'Buy'];
      this.subLabels = ['Direct', 'Social Media', 'Ads', 'Other'];
      this.values = [[3000, 2500, 2000, 4500], [3000, 1700, 500, 500], [600, 200, 100, 30]];
      this.colors = [['#A0BBFF', '#EC77FF'], ['#FFB178', '#FF78B1', '#FF3C8E'], ['#A0F9FF', '#7795FF']];
    },
    makeVertical: function makeVertical() {
      this.direction = 'vertical';
      this.height = 500;
      this.width = 400;
      this.gradientV();
    },
    makeHorizontal: function makeHorizontal() {
      this.direction = 'horizontal';
      this.height = 300;
      this.width = 800;
      this.gradientH();
    },
    toggleDirection: function toggleDirection() {
      this.direction === 'horizontal' ? this.makeVertical() : this.makeHorizontal();
    },
    gradientV: function gradientV() {
      this.gradientDirection = 'vertical';
    },
    gradientH: function gradientH() {
      this.gradientDirection = 'horizontal';
    },
    toggleGradient: function toggleGradient() {
      this.gradientDirection === 'horizontal' ? this.gradientV() : this.gradientH();
    },
    getNextSet: function getNextSet() {
      this.dataSetNum++;

      if (this.dataSetNum > 6) {
        this.dataSetNum = 1;
      }

      this["useDataSet".concat(this.dataSetNum)]();
    }
  }
});