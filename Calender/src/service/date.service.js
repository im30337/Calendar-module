import { Subject, BehaviorSubject, merge } from "rxjs";
import { startWith, map, mergeMap, tap, scan, filter, take } from "rxjs/operators";

export default class DateService {
    constructor() {
      // all date data
      this.date = new BehaviorSubject();
      this.date$ = this.date.asObservable().pipe(
        filter(data => !!data),
        map(data => {return data.default}));

       //calendar range
       this.calendarRange$ = this.date$.pipe(
        map(
          data => {
            let yearRange = this.getYearRange(this.getYears(data)), firstYearData = [], lastYearData = [], range = {first: {y: yearRange.first, m: 13}, last: {y: yearRange.last, m: 0}};
           
            data.forEach(e => {
              //first date
              if(e.date.split('/')[0] == yearRange.first) {
                firstYearData.push({m: parseInt(e.date.split('/')[1])})
                firstYearData.forEach(e => {range.first.m = range.first.m > e.m ? e.m : range.first.m;})
              }
              //last date
              if(e.date.split('/')[0] == yearRange.last) {
                lastYearData.push({m: parseInt(e.date.split('/')[1])})
                lastYearData.forEach(e => {range.last.m = range.last.m < e.m ? e.m : range.last.m;})
            }
            });
            return range;
          }
        )
      )

      //current y/m
      this.display = new BehaviorSubject();
      this.display$ = this.display.asObservable();
      
      // current month calendar
      this.month$ = this.display$.pipe(
          map(data => {
            //current month
            let firstDay = new Date(data.y,data.m-1,1).getDay();
            let monthDays = new Date(data.y,data.m,0).getDate();
            let Week = [[],[],[],[],[],[],[]];
              //col
              for(var i =0; i < 7; i++) {
                if(i < firstDay) 
                {
                  Week[i].push(0);
                  for(var j = 0; j < 5;j++) {
                    let first = firstDay == 0 && i == 0 ?  1 + i : 7 - firstDay + 1 + i;
                    let date = j*7+first > monthDays ? 0 : j*7+first;
                    Week[i].push(date);
                  }
                }
                else {
                  for(var j = 0; j < 6;j++) {
                    let first = i - firstDay +1 ;
                    let date = j*7+first > monthDays ? 0 : j*7+first;
                    Week[i].push(date);
                  }
                }
              }
              return Week;
          }),
          filter(data => !!data)
      )

      //current month data
      this.monthData$ = this.date$.pipe(
        mergeMap(
          _ => this.display$,
          (all, currentYM) => (all.filter(
            e => parseInt(e.date.split('/')[0]) == currentYM.y ? parseInt(e.date.split('/')[1]) == currentYM.m ? true : false : false
          ))
        ),
      )

      //sort current month data 
      this.sortMonthData$ = this.monthData$.pipe(
        map(monthData => {
          let sortMonthData = this.sortData(monthData);
          let totalPage = sortMonthData.length%8 > 0 ? Math.floor(sortMonthData.length/8) + 1 : Math.floor(sortMonthData.length/8);
          let listData = [];
           for(var i = 0; i < totalPage; i++) {
             let pageData = []
             for(var j = 0; j < 8; j++) {
               !!sortMonthData[j+i*8] ? pageData.push(sortMonthData[j+i*8]) : ''
             }
             listData.push(pageData);
           }
          return({sortMonthData, listData, totalPage})
        })
      )
  
      //list page 
      this.page = new Subject();
      this.page$ = this.page.asObservable().pipe(
        startWith(1),
        mergeMap(
          _ => this.sortMonthData$.pipe(take(1)),
          (currentPage, sortMonthData) => {
            // console.log(sortMonthData)
            let page = currentPage < sortMonthData.totalPage ? currentPage > 0 ? currentPage : 1 : sortMonthData.totalPage
            return page
          }
        ));


      //method binding
      this.switchMonth = this.switchMonth.bind(this);
      this.getYears = this.getYears.bind(this);
      this.getYearRange = this.getYearRange.bind(this);
      this.sortData = this.sortData.bind(this);
      this.filterData = this.filterData.bind(this);
    }

    //---------------method---------------

    //change month
    switchMonth(distance) {
      this.calendarRange$.pipe(
        mergeMap(_ => this.display$,(range, current) => ({range, current})),take(1)).subscribe(
        data => {
          // console.log(data.range)
          let m = data.current.m + distance > 12 ? 1 : data.current.m + distance < 1 ? 12 : data.current.m + distance;
          let y = data.current.m + distance > 12 ? data.current.y + 1 : data.current.m + distance < 1 ? data.current.y - 1 : data.current.y;
          //only display months which in data
          //max
          y > data.range.last.y ? this.display.next({y: data.range.last.y, m: data.range.last.m}) : 
          m > data.range.last.m && y == data.range.last.y ? this.display.next({y: data.range.last.y, m: data.range.last.m}) : 
          //min
          y < data.range.first.y ? this.display.next({y: data.range.first.y, m: data.range.first.m}) : 
          m < data.range.first.m && y == data.range.first.y ? this.display.next({y: data.range.first.y, m: data.range.first.m}) : 
          this.display.next({y,m});
        }
      )
    }

    //get all years
    getYears(data) {
      let y = [];
      for(var i=0; i< data.length; i++) {
          let date = data[i].date;
          y.includes(date.split('/')[0]) ? true : y.push(date.split('/')[0]);
        }
      return y;
    }
    //get first and last year
    getYearRange(date) {
      let year = [], first, last;
      date.forEach(e => {
        year.push(parseInt(e))
      })
      first = year[0];
      last = year[year.length-1]
      year.forEach(e => {
        first = e < first ? e : first;
        last = e > last ? e : last;
      })
      return({first,last});
    }

  //sort data min -> max
  sortData(monthData, lowPriceFilter = true) {
    let sortData = [];
    let max =  monthData[0];
    monthData.forEach(e => {
      max = parseInt(e.date.split('/')[2]) > parseInt(max.date.split('/')[2]) ? e : max
    });
    for(var i =0; i < monthData.length; i++) {
      let first = max;
      monthData.filter(e => !sortData.includes(e)).forEach(e => {first = parseInt(first.date.split('/')[2]) < parseInt(e.date.split('/')[2]) ? first :  e;})
      sortData.push(first)
    }
    return(lowPriceFilter ? this.filterData(sortData) : sortData)
  }

  //get cheapest price in the same date
  filterData(sortData) {
    let finishData = [], filterData = [];
    sortData.forEach(
      data => {
        if(!finishData.includes(data.date)) {
          let same = sortData.filter(e => e.date == data.date);
          if(same.length > 1) {
            let cheapest = same[0];
            same.forEach(e => {cheapest = e.price < cheapest.price ? e : cheapest})
            filterData.push(cheapest)
          }
          else {
            filterData.push(data);
          }
          finishData.push(data.date);
        }
      }
    )
    return filterData
  }
}