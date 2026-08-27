package com.gigglegrid.controller;

import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpSession;
import com.gigglegrid.model.Comment;
import com.gigglegrid.model.User;
import com.gigglegrid.service.CommentService;
import com.gigglegrid.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/memes")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private UserService userService;

    @GetMapping("/{id}/comments")
    public ResponseEntity<?> getComments(@PathVariable Long id) {
        List<Map<String, Object>> comments = commentService.getComments(id).stream().map(c -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", c.getId());
            map.put("text", c.getText());
            map.put("createdAt", c.getCreatedAt());
            map.put("author", c.getUser().getUsername());
            return map;
        }).toList();
        return ResponseEntity.ok(comments);
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<?> addComment(@PathVariable Long id, @RequestBody Map<String, String> body, HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Login required"));
        }
        User user = userService.getById(userId);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid session"));
        }
        String text = body.get("text");
        if (text == null || text.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Comment text is required"));
        }
        Comment comment = commentService.addComment(id, user, text.trim());
        Map<String, Object> map = new java.util.HashMap<>();
        map.put("id", comment.getId());
        map.put("text", comment.getText());
        map.put("createdAt", comment.getCreatedAt());
        map.put("author", comment.getUser().getUsername());
        return ResponseEntity.ok(map);
    }
}