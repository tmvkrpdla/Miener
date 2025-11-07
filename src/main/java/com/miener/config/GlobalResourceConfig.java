package com.miener.config;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;
import java.util.Random;

@ControllerAdvice
public class GlobalResourceConfig {

    @ModelAttribute("resourceVersion")
    public String globalResourceVersion() {
        Random random = new Random();
        return "1." + random.nextInt(10000);
    }
}
