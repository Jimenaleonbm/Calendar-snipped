import moment from "moment";

const calendarMixin = {
    data(){
        return {
            calendar: [],
            selectDate: null,
            today: null,
            weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            momentFormat: 'YYYY-MM-DD'
        }
    },
    methods: {
        getCurrentMonth(){
            this.calendar = [];
            const startDay = moment(this.selectDate).clone().startOf('month').startOf('week');
            const endDay = moment(this.selectDate).clone().endOf('month').endOf('week');
            let date = startDay.clone().subtract(1, 'day');
            while (date.isBefore(endDay, 'day')) {
                this.calendar.push({
                    totalHoursWeek: 0,
                    //week: this.getWeekOfYear(date),
                    days: Array(7).fill(0).map(() => (
                        {
                            id: null,
                            day: date.add(1, 'day').clone().toDate()
                        }
                    ))
                })
            }
            this.updateParent(startDay, endDay);
        },
        getTodayMonth(){
            this.selectDate = moment(this.today).clone().startOf('month').format(this.momentFormat);
            this.getCurrentMonth();
        },
        getNextMonth(){
            this.selectDate = moment(this.selectDate).clone().add(1, 'month');
            this.getCurrentMonth();
        },
        getPreviousMonth(){
            this.selectDate = moment(this.selectDate).clone().subtract(1, 'month');
            this.getCurrentMonth();
        },
        isToday(date){
            return moment(date).format(this.momentFormat) === moment(this.today).format(this.momentFormat)
        },
        notCurrentMonth(date){
            return moment(date).format('MMMM') !== moment(this.selectDate).format('MMMM')
        },
        toMomentFormat(date){
            return moment(date).format(this.momentFormat).toString()
        },
        isAvailableToUpdate(date){
            /*
            * Works for add the class to show disable days before the request start
            * */
            let start = moment(this.startDate).subtract(1, 'day');
            let oneMonth = moment().add(1, 'month');
            if (moment(date).toDate() > start.toDate() && moment(date).toDate() < oneMonth.toDate()){
                return true;
            }
            return false;
        }
    },
    created() {
        this.today = moment().toDate();
        if (this.status){
            switch (this.status){
                case this.$statusFinalized:
                case this.$statusCancelled:
                    this.selectDate = moment(this.startDate).toDate();
                    this.getCurrentMonth();
                    return;
                default :
                    this.selectDate = this.today;
                    this.getTodayMonth();
                    return;
            }
        } else {
            this.getTodayMonth();
        }
    },
    filters: {
        onlyMonth(value){
            return value ? moment(value).format('MMMM').toString() : value;
        },
        onlyYear(value){
            return value ? moment(value).format('YYYY').toString() : value;
        },
        onlyDay(value){
            return value ? moment(value).format('DD').toString() : value;
        }
    }
};

export default calendarMixin;
