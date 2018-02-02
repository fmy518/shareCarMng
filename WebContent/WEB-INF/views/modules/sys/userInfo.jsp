<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/views/include/taglib.jsp"%>
<html>
<head>
	<title>个人信息</title>
	<meta name="decorator" content="default"/>
	<link href="${ctxStatic}/jquery-easyui/themes/default/easyui.css" type="text/css" rel="stylesheet" />
	<script type="text/javascript">
		$(document).ready(function() {
			$("#inputForm").validate({rules: {
				mobile:{required : true,mobile:$('#mobile').val()}
			   },
				submitHandler: function(form){
					loading('正在提交，请稍等...');
					form.submit();
				},
				errorContainer: "#messageBox",
				errorPlacement: function(error, element) {
					$("#messageBox").text("输入有误，请先更正。");
					if (element.is(":checkbox")||element.is(":radio")||element.parent().is(".input-append")){
						error.appendTo(element.parent().parent());
					} else {
						error.insertAfter(element);
					}
				}
			});
		});
	</script>
</head>
<body >
	<ul class="nav nav-tabs">
		<li class="active"><a href="${ctx}/sys/user/info">个人信息</a></li>
		<li><a href="${ctx}/sys/user/modifyPwd">修改密码</a></li>
	</ul><br/>
	<form:form id="inputForm" modelAttribute="user" action="${ctx}/sys/user/info" method="post" class="form-horizontal" style="width:98%">
		<sys:message content="${message}"/>
		<div class="form-group">
			<label class="col-sm-2 control-label">归属公司:</label>
			<div class="col-sm-10">
				<label class="control-label ">${user.company.name}</label>
			</div>
		</div>
		<div class="form-group">
			<label class="col-sm-2 control-label">归属部门:</label>
			<div class="col-sm-10">
				<label class="control-label ">${user.office.name}</label>
			</div>
		</div>
		<div class="form-group">
			<label class="col-sm-2 control-label">姓名:</label>
			<div class="col-sm-10">
				<form:input path="name" htmlEscape="false" maxlength="50" class="required form-control input-medium" readonly="true"/>
			</div>
		</div>
		<div class="form-group">
			<label class="col-sm-2 control-label">邮箱:</label>
			<div class="col-sm-10">
				<form:input path="email" htmlEscape="false" maxlength="50" class="email form-control input-medium"/>
			</div>
		</div>
		<div class="form-group">
			<label class="col-sm-2 control-label">电话:</label>
			<div class="col-sm-10">
				<form:input path="phone" htmlEscape="false" maxlength="50" class="form-control input-medium"/>
			</div>
		</div>
		<div class="form-group">
			<label class="col-sm-2 control-label">手机:</label>
			<div class="col-sm-10">
				<div  class="pull-left">  
				   <form:input path="mobile" htmlEscape="false" maxlength="50" class="required form-control input-medium pull-left"/>
			    </div>
			     <div class="help-inline">&nbsp;   <font color="red">*</font></div>
			</div>
			
		</div>
		<div class="form-group">
			<label class="col-sm-2 control-label">备注:</label>
			<div class="col-sm-10">
				<form:textarea path="remarks" htmlEscape="false" rows="3" maxlength="200" class="form-control input-xxlarge"  />
			</div>
		</div>
		<div class="form-group">
			<label class="col-sm-2 control-label">用户类型:</label>
			<div class="col-sm-10">
				<label class="control-label">${fns:getDictLabel(user.userType, 'sys_user_type', '无')}</label>
			</div>
		</div>
		<div class="form-group">
			<label class="col-sm-2 control-label">用户角色:</label>
			<div class="col-sm-10">
				<label class="control-label">${user.roleNames}</label>
			</div>
		</div>
		<div class="form-group">
			<label class="col-sm-2 control-label">上次登录:</label>
			<div class="col-sm-10">
				<label class="control-label">IP: ${user.oldLoginIp}&nbsp;&nbsp;&nbsp;&nbsp;时间：<fmt:formatDate value="${user.oldLoginDate}" type="both" dateStyle="full"/></label>
			</div>
		</div>
		<div class="form-group">
		<label class="col-sm-2 control-label"></label>
		<div class="col-sm-10">
			<input id="btnSubmit" class="btn btn-default btn-primary" type="submit" value="保 存"/>
		</div>
		</div>
	</form:form>
</body>
</html>