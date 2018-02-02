package com.hoperun.easysite.common.xss;

import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

public class XSSFilter
  implements Filter
{
  private static Map<String, String> xssMap = new LinkedHashMap();
  
  public void init(FilterConfig filterConfig)
    throws ServletException
  {
    xssMap.put("[s|S][c|C][r|R][i|C][p|P][t|T]", "");
    
    xssMap.put("[\\\"\\'][\\s]*[j|J][a|A][v|V][a|A][s|S][c|C][r|R][i|I][p|P][t|T]:(.*)[\\\"\\']", "\"\"");
    
    xssMap.put("[e|E][v|V][a|A][l|L]\\((.*)\\)", "");
    
    xssMap.put("<", "");
    
    xssMap.put(">", "");
    
    xssMap.put("\\(", "");
    
    xssMap.put("\\)", "");
    
    xssMap.put("'", "'");
    


    xssMap.put("%", " ");
  }
  
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
    throws IOException, ServletException
  {
    chain.doFilter(new XssHttpServletRequestWrapper((HttpServletRequest)request), response);
  }
  
  public void destroy() {}
}
