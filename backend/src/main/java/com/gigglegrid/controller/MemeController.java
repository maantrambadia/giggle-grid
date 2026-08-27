package com.gigglegrid.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import com.gigglegrid.model.Meme;
import com.gigglegrid.model.User;
import com.gigglegrid.service.CommentService;
import com.gigglegrid.service.LikeService;
import com.gigglegrid.service.MemeService;
import com.gigglegrid.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/memes")
public class MemeController {

    @Autowired
    private MemeService memeService;

    @Autowired
    private LikeService likeService;

    @Autowired
    private CommentService commentService;

    @Autowired
    private UserService userService;

    @Autowired
    private ServletContext servletContext;

    @GetMapping
    public ResponseEntity<?> getAll(HttpServletRequest request, @RequestParam(required = false) String keyword) {
        List<Meme> memes = keyword == null || keyword.trim().isEmpty()
                ? memeService.getAll()
                : memeService.search(keyword);
        String baseUrl = getBaseUrl(request);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Meme meme : memes) {
            result.add(mapMeme(meme, baseUrl));
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id, HttpServletRequest request) {
        Meme meme = memeService.getById(id);
        if (meme == null) {
            return ResponseEntity.notFound().build();
        }
        String baseUrl = getBaseUrl(request);
        Map<String, Object> result = mapMeme(meme, baseUrl);
        result.put("comments", mapComments(commentService.getComments(id)));
        return ResponseEntity.ok(result);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getByUser(@PathVariable Long userId, HttpServletRequest request) {
        List<Meme> memes = memeService.getByUserId(userId);
        String baseUrl = getBaseUrl(request);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Meme meme : memes) {
            result.add(mapMeme(meme, baseUrl));
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/upload")
    public ResponseEntity<?> upload(
            @RequestParam("caption") String caption,
            @RequestParam("image") MultipartFile image,
            HttpSession session,
            HttpServletRequest request) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Login required"));
        }
        User user = userService.getById(userId);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid session"));
        }
        if (image == null || image.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Image is required"));
        }
        try {
            String uploadDir = servletContext.getRealPath("/uploads");
            if (uploadDir == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Upload directory not available"));
            }
            File dir = new File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }
            String original = image.getOriginalFilename();
            String ext = original != null ? original.substring(original.lastIndexOf(".")) : ".jpg";
            String fileName = UUID.randomUUID().toString() + ext;
            Path filePath = Paths.get(uploadDir, fileName);
            Files.copy(image.getInputStream(), filePath);

            Meme meme = new Meme();
            meme.setCaption(caption);
            meme.setImageUrl("uploads/" + fileName);
            meme.setUser(user);
            memeService.save(meme);

            String baseUrl = getBaseUrl(request);
            Map<String, Object> response = new HashMap<>();
            response.put("id", meme.getId());
            response.put("caption", meme.getCaption());
            response.put("imageUrl", baseUrl + "/" + meme.getImageUrl());
            response.put("createdAt", meme.getCreatedAt());
            response.put("author", user.getUsername());
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Failed to upload image"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Login required"));
        }
        User user = userService.getById(userId);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid session"));
        }
        try {
            memeService.delete(id, user);
            return ResponseEntity.ok(Map.of("message", "Meme deleted"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
        }
    }

    private String getBaseUrl(HttpServletRequest request) {
        return request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath();
    }

    private Map<String, Object> mapMeme(Meme meme, String baseUrl) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", meme.getId());
        map.put("caption", meme.getCaption());
        map.put("imageUrl", baseUrl + "/" + meme.getImageUrl());
        map.put("createdAt", meme.getCreatedAt());
        map.put("author", meme.getUser().getUsername());
        map.put("likeCount", likeService.countLikes(meme.getId()));
        map.put("commentCount", commentService.countComments(meme.getId()));
        return map;
    }

    private List<Map<String, Object>> mapComments(List<com.gigglegrid.model.Comment> comments) {
        List<Map<String, Object>> list = new ArrayList<>();
        for (com.gigglegrid.model.Comment c : comments) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", c.getId());
            map.put("text", c.getText());
            map.put("createdAt", c.getCreatedAt());
            map.put("author", c.getUser().getUsername());
            list.add(map);
        }
        return list;
    }
}