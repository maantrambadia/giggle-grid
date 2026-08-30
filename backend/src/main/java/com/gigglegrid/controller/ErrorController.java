package com.gigglegrid.controller;

import javax.servlet.http.HttpServletRequest;
import com.gigglegrid.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ErrorController {

    @RequestMapping("/error")
    public ResponseEntity<ApiResponse<?>> handleError(HttpServletRequest request) {
        Integer status = (Integer) request.getAttribute("javax.servlet.error.status_code");
        int code = status != null ? status : 500;

        String message;
        if (code == 404) {
            message = "Not found.";
        } else if (code == 403) {
            message = "Forbidden.";
        } else if (code == 401) {
            message = "Unauthorized.";
        } else if (code == 400) {
            message = "Bad request.";
        } else if (code == 405) {
            message = "Method not allowed.";
        } else if (code >= 500) {
            message = "Internal server error.";
        } else {
            message = "Request failed.";
        }

        return ResponseEntity.status(code).body(ApiResponse.fail(code, message));
    }
}
