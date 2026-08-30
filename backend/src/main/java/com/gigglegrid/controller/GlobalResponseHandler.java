package com.gigglegrid.controller;

import java.util.Map;
import javax.servlet.http.HttpServletResponse;
import com.gigglegrid.dto.ApiResponse;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpResponse;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

@ControllerAdvice
public class GlobalResponseHandler implements ResponseBodyAdvice<Object> {

    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        return true;
    }

    @Override
    @SuppressWarnings("unchecked")
    public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType,
                                  Class<? extends HttpMessageConverter<?>> selectedConverterType,
                                  ServerHttpRequest request, ServerHttpResponse response) {
        if (body instanceof ApiResponse || body instanceof String) {
            return body;
        }

        int status = 200;
        if (response instanceof ServletServerHttpResponse servletResponse) {
            HttpServletResponse res = servletResponse.getServletResponse();
            if (res != null) {
                status = res.getStatus();
            }
        }

        if (status >= 400) {
            String message = "Request failed.";

            if (body instanceof Map<?, ?> m) {
                if (m.containsKey("error")) {
                    message = String.valueOf(m.get("error"));
                } else if (m.containsKey("message")) {
                    message = String.valueOf(m.get("message"));
                }
            }

            return ApiResponse.fail(status, message);
        }

        return ApiResponse.ok(body);
    }
}
