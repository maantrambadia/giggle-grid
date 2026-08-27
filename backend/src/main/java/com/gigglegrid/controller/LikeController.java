package com.gigglegrid.controller;

import java.util.Map;
import javax.servlet.http.HttpSession;
import com.gigglegrid.model.User;
import com.gigglegrid.service.LikeService;
import com.gigglegrid.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/memes")
public class LikeController {

    @Autowired
    private LikeService likeService;

    @Autowired
    private UserService userService;

    @PostMapping("/{id}/like")
    public ResponseEntity<?> like(@PathVariable Long id, HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Login required"));
        }
        User user = userService.getById(userId);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid session"));
        }
        boolean liked = likeService.toggleLike(id, user);
        return ResponseEntity.ok(Map.of(
            "liked", liked,
            "likeCount", likeService.countLikes(id)
        ));
    }
}