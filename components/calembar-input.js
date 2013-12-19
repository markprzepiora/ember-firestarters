App.CalembarInputComponent = Ember.Component.extend({
  currentMonth: moment({ day: 1 }),
  maxDate:      moment(),

  startDate:    null,
  endDate:      null,
  lastSelected: 0,

  currentMonthDisplay: function() {
    var currentMonth = this.get('currentMonth');
    return moment(currentMonth).format('MMMM YYYY');
  }.property('currentMonth'),

  nextMonth: function() {
    var currentMonth = this.get('currentMonth');

    return moment(currentMonth).add('months', 1);
  }.property('currentMonth'),

  weekdayOfFirstDay: function() {
    return moment(this.get('currentMonth')).weekday();
  }.property('currentMonth'),

  isSelectable: function(date) {
    var currentMonth = this.get('currentMonth');
    var maxDate      = this.get('maxDate');

    return !moment(date).isBefore(currentMonth) &&
           moment(date).isBefore(maxDate);
  },

  dateObject: function(date) {
    var startDate = this.get('startDate');
    var endDate   = this.get('endDate');
    var className = "";

    if (moment(date).isSame(startDate)) {
      className += "selected ";
    }
    else if (moment(date).isSame(endDate)) {
      className += "selected ";
    }
    else if (moment(date).isBefore(endDate) && moment(startDate).isBefore(date)) {
      className += "between ";
    }

    return Ember.Object.create({
      date:        date.toDate(),
      day:         date.format('DD'),
      weekday:     date.format('dd'),
      value:       date.valueOf(),
      selectable:  this.isSelectable(date),
      className:   className
    });
  },

  firstRow: function() {
    var currentMonth      = this.get('currentMonth');
    var weekdayOfFirstDay = this.get('weekdayOfFirstDay');
    var _this             = this;

    return [0, 1, 2, 3, 4, 5, 6].map(function(weekday) {
      var date = moment(currentMonth).add('days', weekday - weekdayOfFirstDay);
      return _this.dateObject(date);
    });
  }.property('currentMonth', 'startDate', 'endDate'),

  nextRow: function(previousRow) {
    var previousLastDate = previousRow.objectAt(6);
    var _this            = this;

    return [1, 2, 3, 4, 5, 6, 7].map(function(offset) {
      var date = moment(previousLastDate.get('date')).add('days', offset);
      return _this.dateObject(date);
    });
  },

  rows: function() {
    var firstRow  = this.get('firstRow');
    var secondRow = this.nextRow(firstRow);
    var thirdRow  = this.nextRow(secondRow);
    var fourthRow = this.nextRow(thirdRow);
    var fifthRow  = this.nextRow(fourthRow);
    var sixthRow  = this.nextRow(fifthRow);

    return [firstRow, secondRow, thirdRow, fourthRow, fifthRow, sixthRow];
  }.property('firstRow'),

  // ACTIONS
  actions: {
    addMonths: function(n) {
      var currentMonth = this.get('currentMonth');
      var newMonth     = moment(currentMonth).add('months', n);

      this.set('currentMonth', newMonth);
    },

    prevMonth: function() {
      this.send('addMonths', -1);
    },

    nextMonth: function() {
      var maxDate   = this.get('maxDate');
      var nextMonth = this.get('nextMonth');

      if (nextMonth.isBefore(maxDate))
        this.send('addMonths', 1);
    },

    selectDate: function(date) {
      var lastSelected = this.get('lastSelected');

      if (lastSelected == 0)
        this.set('startDate', date);
      else
        this.set('endDate', date);

      this.set('lastSelected', (lastSelected + 1) % 2);
      this.swapDates();
    }
  },

  swapDates: function() {
    var startDate    = this.get('startDate');
    var endDate      = this.get('endDate');
    var lastSelected = this.get('lastSelected');

    if (startDate && endDate && moment(endDate).isBefore(startDate)) {
      this.set('startDate', endDate);
      this.set('endDate', startDate);
      this.set('lastSelected', (lastSelected + 1) % 2);
    }
  }
});
