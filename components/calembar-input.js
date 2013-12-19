App.CalembarInputComponent = Ember.Component.extend({
  // The current month displayed in the component. Defaults to the present
  // month.
  currentMonth: moment({ day: 1 }),

  // The selected date.
  date: null,

  // A textual representation of the current month, e.g. "November 2013".
  currentMonthDisplay: function() {
    var currentMonth = this.get('currentMonth');
    return moment(currentMonth).format('MMMM YYYY');
  }.property('currentMonth'),

  weekdayOfFirstDay: function() {
    return moment(this.get('currentMonth')).weekday();
  }.property('currentMonth'),

  isSelectable: function(date) {
    return true;
  },

  dateObject: function(date) {
    var selectedDate = this.get('date');
    var className;

    if (moment(date).isSame(selectedDate)) {
      className = "selected";
    }
    else {
      className = "";
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
  }.property('currentMonth', 'date'),

  nextRow: function(previousRow) {
    var previousLastDate = previousRow.objectAt(6);
    var _this            = this;

    return [1, 2, 3, 4, 5, 6, 7].map(function(offset) {
      var date = moment(previousLastDate.get('date')).add('days', offset);
      return _this.dateObject(date);
    });
  },

  rows: function() {
    var firstRow           = this.get('firstRow');
    var secondRow          = this.nextRow(firstRow);
    var thirdRow           = this.nextRow(secondRow);
    var fourthRow          = this.nextRow(thirdRow);
    var fifthRow           = this.nextRow(fourthRow);
    var sixthRow           = this.nextRow(fifthRow);
    var firstDayOfSixthRow = sixthRow[0];

    if (moment(firstDayOfSixthRow.date).date() <= 6)
      return [firstRow, secondRow, thirdRow, fourthRow, fifthRow];
    else
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
      this.send('addMonths', 1);
    },

    selectDate: function(date) {
      this.set('date', date);
    }
  }
});
