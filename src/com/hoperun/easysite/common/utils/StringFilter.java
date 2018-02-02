package com.hoperun.easysite.common.utils;

import java.io.IOException;
import java.io.InputStream;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;

import javax.xml.parsers.DocumentBuilderFactory;
/**
 * 安全方法
 * @author qin_wencheng
 * @version 2016-12-25
 */
public class StringFilter {

	// 过滤特殊字符
	public static String filter(String str) throws PatternSyntaxException {
		// 只允许字母和数字
		// String regEx = "[^a-zA-Z0-9]";
		// 清除掉所有特殊字符
		String regEx="[`~!@#$%^&*()+=|{}':;',\\[\\].<>/?~！@#￥%……&*（）——+|{}【】‘；：”“’。，、？]"; 
		Pattern p = Pattern.compile(regEx);
		Matcher m = p.matcher(str);
		return m.replaceAll("").trim();
	}
	//路径过滤
	public static boolean isSecurePath(String filePath) {
	    String[] blackListChars = {".."};
	    return (StringUtils.indexOfAny(filePath, blackListChars)< 0);
	}
	
	// 禁用外部实体的方法  XML External Entity Injection
	public static void xmlFilter(String str) throws PatternSyntaxException {
		DocumentBuilderFactory dbf =DocumentBuilderFactory.newInstance();
		dbf.setExpandEntityReferences(false);
	}
	//关闭文件流   Unreleased Resource: Streams
	public static InputStream closeStream(InputStream writer) throws IOException {
		if(writer!=null){
			writer.close();
		}
		return writer;
	}
}
