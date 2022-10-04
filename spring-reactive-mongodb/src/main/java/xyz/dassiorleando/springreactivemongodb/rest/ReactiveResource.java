package xyz.dassiorleando.springreactivemongodb.rest;

import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
public class ReactiveResource {
    @GetMapping("/reactive/mono")
    public Mono<String> write() {
        return Mono.just("Mono string");
    }

    @GetMapping("/reactive/flux")
    public Flux<String> read() {
        return Flux.fromArray(new String[]{"A", "B", "C"});
    }
}
