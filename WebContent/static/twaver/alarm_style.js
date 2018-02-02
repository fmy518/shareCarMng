//TWaver内部预定义六中告警级别
twaver.AlarmSeverity.CRITICAL = twaver.AlarmSeverity.add(500,'Critical','C',"#FF0000");
twaver.AlarmSeverity.MAJOR = twaver.AlarmSeverity.add(400,'Major','M',"#FFA000");
twaver.AlarmSeverity.MINOR = twaver.AlarmSeverity.add(300,'Minor','m',"#FFFF00");
twaver.AlarmSeverity.WARNING = twaver.AlarmSeverity.add(200,'Warning','W',"#00FFFF");
twaver.AlarmSeverity.INDETERMINATE = twaver.AlarmSeverity.add(100,'Indeterminate','N',"#C800FF");
twaver.AlarmSeverity.CLEARED = twaver.AlarmSeverity.add(0,'Cleared','R',"#00FF00");
//添加告警级别
twaver.AlarmSeverity.add:function(value,name,nickName,colour,displayName)
//删除告警级别
twaver.AlarmSeverity.remove:function(name)
//清空告警级别
twaver.AlarmSeverity.clear:function()