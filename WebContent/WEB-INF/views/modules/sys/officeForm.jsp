<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/views/include/taglib.jsp"%>
<html>
<head>
	<title>机构管理</title>
	<meta name="decorator" content="default"/>
	<script type="text/javascript">
		$(document).ready(function() {
			$("#name").focus();
			$("#inputForm").validate({
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
<body>
	<ul class="nav nav-tabs">
		<li><a href="${ctx}/sys/office/list?id=${office.parent.id}&parentIds=${office.parentIds}">机构列表</a></li>
		<li class="active"><a href="${ctx}/sys/office/form?id=${office.id}&parent.id=${office.parent.id}">机构<shiro:hasPermission name="sys:office:edit">${not empty office.id?'修改':'添加'}</shiro:hasPermission><shiro:lacksPermission name="sys:office:edit">查看</shiro:lacksPermission></a></li>
	</ul><br/>
	<form:form id="inputForm" modelAttribute="office" action="${ctx}/sys/office/save" method="post" class="form-horizontal" role="form" >
		<form:hidden path="id"/>
		<sys:message content="${message}"/>
		<div class="form-group"  >
			<label class="control-label col-sm-2 col-sm-2" style="line-height: 30px;">上级机构:</label>
			<div class="col-sm-10">
				<div  class="pull-left"> 
                <sys:treeselect id="office" name="parent.id" value="${office.parent.id}" labelName="parent.name" labelValue="${office.parent.name}"
					title="机构" url="/sys/office/treeData" extId="${office.id}" cssClass=" required form-control " allowClear="${office.currentUser.admin}"/>
			   </div>
			    <div class="help-inline">&nbsp;<font color="red">*</font> </div>
			</div>
		</div>
		<div class="form-group">
			<label class="control-label col-sm-2 col-sm-2">归属区域:</label>
			<div class="col-sm-2">
                <sys:treeselect id="area" name="area.id" value="${office.area.id}" labelName="area.name" labelValue="${office.area.name}"
					title="区域" url="/sys/area/treeData" cssClass="required form-control"/>
			</div>
		</div>
		<div class="form-group">
			<label class="control-label col-sm-2">机构名称:</label>
			<div class="col-sm-10">
				<div  class="pull-left">  
				<form:input path="name" htmlEscape="false" maxlength="50" class="required form-control input-medium pull-left"/>
			</div>
			<div class="help-inline">&nbsp;<font color="red">*</font> </div>
			</div>
		</div>
		<div class="form-group">
			<label class="control-label col-sm-2">机构编码:</label>
			<div class="col-sm-2">
				<form:input path="code" htmlEscape="false" maxlength="50" class="form-control input-medium"/>
			</div>
		</div>
		<div class="form-group">
			<label class="control-label col-sm-2">机构类型:</label>
			<div class="col-sm-2">
				<form:select path="type" class="input-medium">
					<form:options items="${fns:getDictList('sys_office_type')}" itemLabel="label" itemValue="value" htmlEscape="false"/>
				</form:select>
			</div>
		</div>
		<div class="form-group">
			<label class="control-label col-sm-2">机构级别:</label>
			<div class="col-sm-2">
				<form:select path="grade" class="input-medium">
					<form:options items="${fns:getDictList('sys_office_grade')}" itemLabel="label" itemValue="value" htmlEscape="false"/>
				</form:select>
			</div>
		</div>
		<div class="form-group">
			<label class="control-label col-sm-2">是否可用:</label>
			<div class="col-sm-2">
				<form:select path="useable">
					<form:options items="${fns:getDictList('yes_no')}" itemLabel="label" itemValue="value" htmlEscape="false"/>
				</form:select>
			</div>
		</div>
		<div class="form-group">
			<label class="control-label col-sm-2">主负责人:</label>
			<div class="col-sm-2">
				 <sys:treeselect id="primaryPerson" name="primaryPerson.id" value="${office.primaryPerson.id}" labelName="office.primaryPerson.name" labelValue="${office.primaryPerson.name}"
					title="用户" url="/sys/office/treeData?type=3" allowClear="true" notAllowSelectParent="true"  cssClass="form-control"/>
			</div>
		</div>
		<div class="form-group">
			<label class="control-label col-sm-2">副负责人:</label>
			<div class="col-sm-2">
				 <sys:treeselect id="deputyPerson" name="deputyPerson.id" value="${office.deputyPerson.id}" labelName="office.deputyPerson.name" labelValue="${office.deputyPerson.name}"
					title="用户" url="/sys/office/treeData?type=3" allowClear="true" notAllowSelectParent="true" cssClass="form-control"/>
			</div>
		</div>
		<div class="form-group">
			<label class="control-label col-sm-2">联系地址:</label>
			<div class="col-sm-2">
				<form:input path="address" htmlEscape="false" maxlength="50" class="form-control input-medium"/>
			</div>
		</div>
		<div class="form-group">
			<label class="control-label col-sm-2">邮政编码:</label>
			<div class="col-sm-2"> 
				<form:input path="zipCode" htmlEscape="false" maxlength="50" class="form-control input-medium"/>
			</div>
		</div>
		<div class="form-group">
			<label class="control-label col-sm-2">负责人:</label>
			<div class="col-sm-2">
				<form:input path="master" htmlEscape="false" maxlength="50" class="form-control input-medium"/>
			</div>
		</div>
		<div class="form-group">
			<label class="control-label col-sm-2">电话:</label>
			<div class="col-sm-2">
				<form:input path="phone" htmlEscape="false" maxlength="50" class="form-control input-medium"/>
			</div>
		</div>
		<div class="form-group">
			<label class="control-label col-sm-2">传真:</label>
			<div class="col-sm-2">
				<form:input path="fax" htmlEscape="false" maxlength="50" class="form-control input-medium"/>
			</div>
		</div>
		<div class="form-group">
			<label class="control-label col-sm-2">邮箱:</label>
			<div class="col-sm-2">
				<form:input path="email" htmlEscape="false" maxlength="50" class="form-control input-medium"/>
			</div>
		</div>
		<div class="form-group">
			<label class="control-label col-sm-2">备注:</label>
			<div class="col-sm-6">
				<form:textarea path="remarks" htmlEscape="false" rows="3" maxlength="200" class="input-xlarge form-control"/>
			</div>
		</div>
		<c:if test="${empty office.id}">
			<div class="form-group">
				<label class="control-label col-sm-2">快速添加下级部门:</label>
				<div class="col-sm-5" style="padding-top: 7px;">
					<form:checkboxes path="childDeptList" items="${fns:getDictList('sys_office_common')}" itemLabel="label" itemValue="value" htmlEscape="false"/>
				</div>
			</div>
		</c:if>
		<div class="form-group">
			<label class="control-label col-sm-2"></label>
				<div class="col-sm-10">
			<shiro:hasPermission name="sys:office:edit"><input id="btnSubmit" class="btn btn-default btn-primary" type="submit" value="保 存"/>&nbsp;</shiro:hasPermission>
			<input id="btnCancel" class="btn btn-default" type="button" value="返 回" onclick="history.go(-1)"/>
			</div>
		</div>
	</form:form>
</body>
</html>