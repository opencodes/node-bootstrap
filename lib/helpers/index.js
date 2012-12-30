var util = require('util');
var moment = require('moment');

var sth = {
    /*
     * Formating date time in required format
     * @param date must be in mysql date time format
     * @output output date format 
     */
    dateFormat:function(date,outputformat){
      var day = moment(date);
      return day.format("dddd, MMMM Do YYYY");
    },
    gender :[{'label':'Male','value':'male'},{'label':'Female','value':'female'}],
    
    caste :[{'label':'Gen','value':'Gen'},{'label':'Sc','value':'Sc'},{'label':'ST','value':'ST'},
            {'label':'Annex-1','value':'Annex-1'},{'label':'Annex-2','value':'Annex-2'}],
            
    category:[{'label':'Regular','value':'Regular'},{'label':'private','value':'private'},{'label':'Ex','value':'Ex'}],
    
    faculty:[{'label':'Science','value':'science'},{'label':'Commerce','value':'commerce'},{'label':'Art','value':'art'}],
    
    subject:{NRB :[{'label':'R. B.','value':'RB.'},
                   {'label':'Non-Hindi','value':'Non-Hindi'}],
      
             MB : [{'label':'Alt. English','value':'AE'},
                   {'label':'Urdu','value':'UR'},
                   {'label':'Maithili','value':'MA'}],
             
             LL  :[{'label':'English','value':'ENG'},
                   {'label':'Sanskrit','value':'SNK'},
                   {'label':'Magahi','value':'MAG'},
                   {'label':'Prakrit','value':'PRA'},
                   {'label':'Hindi','value':'HIN'},
                   {'label':'Maithili','value':'MAI'},
                   {'label':'Bhojpuri','value':'BHO'},
                   {'label':'Arabic','value':'ARB'},
                   {'label':'Urdu','value':'URD'},
                   {'label':'Bangla','value':'BAN'},
                   {'label':'Pali','value':'PAL'},
                   {'label':'Persian','value':'PER'}],
                 
             OPT:{science: [{'label':'Physics','value':'PHY'},
                            {'label':'Chemistry','value':'CHE'},
                            {'label':'Biology','value':'BIO'}
                           ,{'label':'Mathematics','value':'MAT'}],
                           
                  commerce:[{'label':'Accountancy','value':'ACY'},
                            {'label':'Economics','value':'ECO'},
                            {'label':'Business Studies','value':'BST'},
                            {'label':'Entrepreneurship','value':'EPS'}],
                            
                  art:     [{'label':'Philosophy','value':'PHL'},
                            {'label':'Economics','value':'ECO'},
                            {'label':'Psychology','value':'PSY'},
                            {'label':'History','value':'HIS'},
                            {'label':'Geography','value':'GEO'},
                            {'label':'Music','value':'MUS'},
                            {'label':'Mathematics','value':'MAT'},
                            {'label':'Political Science','value':'POL'},
                            {'label':'Sociology','value':'SOC'},
                            {'label':'Home Science','value':'POL'},
                            {'label':'Yog & Physical Edu','value':'YPE'}]}
    }

};
//Thu, 03 May 2012 07:37:43 GMT
module.exports = sth;
//----------------------------------------------------------------------------
if (require.main === module) {
  (function () {
    function logcb(err, obj) {
      util.log(err || util.inspect(obj));
      process.exit(0);
    }
    util.log(sth.dateFormat('2012-05-03 13:07:43'));
  })();
}
