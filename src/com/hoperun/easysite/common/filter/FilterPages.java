package com.hoperun.easysite.common.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.log4j.Logger;


public class FilterPages implements Filter{
	
	private static final Logger logger = Logger.getLogger(FilterPages.class);
	
	@Override
	public void destroy() {

	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {	
			
	    HttpServletRequest req = (HttpServletRequest) request;  
        HttpServletResponse resp = (HttpServletResponse) response;
        String servletPath = req.getRequestURI();
        /* 其它一些判断*/
        if(servletPath.indexOf("theme")>0 ){         
            resp.sendRedirect("/easysite"); //如果是外部非法url,直接跳回首页 
        }
        else
        {
        	chain.doFilter(request, response);
        }
	}

	@Override
	public void init(FilterConfig arg0) throws ServletException {
	
	}

}
