<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/views/include/taglib.jsp"%>
<html>
<head>
	<title>菜单管理</title>
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
		<li><a href="${ctx}/sys/menu/">菜单列表</a></li>
		<li class="active"><a href="${ctx}/sys/menu/form?id=${menu.id}&parent.id=${menu.parent.id}">菜单<shiro:hasPermission name="sys:menu:edit">${not empty menu.id?'修改':'添加'}</shiro:hasPermission><shiro:lacksPermission name="sys:menu:edit">查看</shiro:lacksPermission></a></li>
	</ul><br/>
	<form:form id="inputForm" modelAttribute="menu" action="${ctx}/sys/menu/save" method="post" class="form-horizontal">
		<form:hidden path="id"/>
		<sys:message content="${message}"/>
		<div class="form-group">
			<label class="control-label col-sm-2">上级菜单:</label>
			<div class="col-sm-10">
                <sys:treeselect id="menu" name="parent.id" value="${menu.parent.id}" labelName="parent.name" labelValue="${menu.parent.name}"
					title="菜单" url="/sys/menu/treeData" extId="${menu.id}" cssClass="required form-control input-medium"/>
			</div>
		</div>
		<div class="form-group">
			<label class="control-label col-sm-2">名称:</label>
			<div class="col-sm-10">
			<div  class="pull-left">  
				<form:input path="name" htmlEscape="false" maxlength="50" class="required form-control input-medium pull-left"/>
				</div>
		    <div class="help-block">&nbsp;   <font color="red">*</font></div>
			</div>
		</div>
		<div class="form-group">
			<label class="control-label col-sm-2">链接:</label>
			<div class="col-sm-10">
				<form:input path="href" htmlEscape="false" maxlength="2000" class="input-xxlarge form-control"/>
				<span class="help-block">点击菜单跳转的页面</span>
			</div>
		</div>
		<div class="form-group">
			<label class="control-label col-sm-2">目标:</label>
			<div class="col-sm-10">
				<form:input path="target" htmlEscape="false" maxlength="10" class=" form-control input-medium"/>
				<span class="help-block">链接地址打开的目标窗口，默认：mainFrame</span>
			</div>
		</div>
		<div class="form-group">
			<label class="control-label col-sm-2">图标:</label>
			<div class="col-sm-10">
				<sys:iconselect id="icon" name="icon" value="${menu.icon}"/>
			</div>
		</div>
		<div class="form-group">
			<label class="control-label col-sm-2">排序:</label>
			<div class="col-sm-10">
				<form:input path="sort" htmlEscape="false" maxlength="50" class="required digits input-medium form-control"/>
				<span class="help-block">排列顺序，升序。</span>
			</div>
		</div>
		<div class="form-group">
			<label class="control-label col-sm-2">可见:</label>
			<div class="col-sm-10">
				<form:radiobuttons path="isShow" items="${fns:getDictList('show_hide')}" itemLabel="label" itemValue="value" htmlEscape="false" class="required"/>
				<span class="help-block">该菜单或操作是否显示到系统菜单中</span>
			</div>
		</div>
		<div class="form-group">
			<label class="control-label col-sm-2">权限标识:</label>
			<div class="col-sm-10">
				<form:input path="permission" htmlEscape="false" maxlength="100" class="input-xxlarge form-control"/>
				<span class="help-block">控制器中定义的权限标识，如：@RequiresPermissions("权限标识")</span>
			</div>
		</div>
		<div class="form-group">
			<label class="control-label col-sm-2">备注:</label>
			<div class="col-sm-10">
				<form:textarea path="remarks" htmlEscape="false" rows="3" maxlength="200" class="input-xxlarge form-control"/>
			</div>
		</div>
		<div class="form-group">
		<label class="control-label col-sm-2"></label>
			<div class="col-sm-10">
			<shiro:hasPermission name="sys:menu:edit"><input id="btnSubmit" class="btn btn-default btn-primary" type="submit" value="保 存"/>&nbsp;</shiro:hasPermission>
			<input id="btnCancel" class="btn btn-default" type="button" value="返 回" onclick="history.go(-1)"/>
			</div>
		</div>
	</form:form>
</body>
</html>