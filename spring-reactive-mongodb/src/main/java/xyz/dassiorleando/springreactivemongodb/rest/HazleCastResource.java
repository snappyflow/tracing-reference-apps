package xyz.dassiorleando.springreactivemongodb.rest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.hazelcast.client.HazelcastClient;
import com.hazelcast.client.config.ClientConfig;
import com.hazelcast.core.HazelcastInstance;
import java.util.List;
import java.util.concurrent.BlockingQueue;
import com.hazelcast.multimap.MultiMap;
import com.hazelcast.replicatedmap.ReplicatedMap;
import java.util.Set;
import com.hazelcast.topic.ITopic;
import com.hazelcast.map.IMap;


@RestController
public class HazleCastResource {

    private final HazelcastInstance client;

    public HazleCastResource() {
        ClientConfig clientConfig = new ClientConfig();
        clientConfig.setClusterName("dev");
        clientConfig.getNetworkConfig().addAddress("192.168.56.110");
        this.client = HazelcastClient.newHazelcastClient(clientConfig);
    }

    @PostMapping("/hazlecast")
    public ResponseEntity<String> write() {
        IMap<Integer, String> map = this.client.getMap("myMap");
        map.put(1, "John");
        return new ResponseEntity<>(
            "Written successfully",  HttpStatus.OK);
    }

    @PostMapping("/hazlecast/list")
    public ResponseEntity<List<String>> listWrite() {
        List<String> list = this.client.getList("country");
        list.add("New Item");
        return new ResponseEntity<List<String>>(list,  HttpStatus.OK);
    }

    @PostMapping("/hazlecast/queue")
    public ResponseEntity<BlockingQueue<String>> queueWrite() {
        BlockingQueue<String> queue = this.client.getQueue("order-queue");
        queue.add("Item1");
        queue.offer("Item2");
        try {
            queue.put("Item3");
        } catch(Exception e) {
            System.out.println("Exception found " + e.getMessage() );
            e.printStackTrace();
        }
        return new ResponseEntity<BlockingQueue<String>>(queue,  HttpStatus.OK);
    }

    @PostMapping("/hazlecast/multiMap")
    public ResponseEntity<String> mmWrite() {
        MultiMap<String, String> map = this.client.getMultiMap("student1-data");
        map.put("name", "Alice");
        map.put("age", "20");
        
        return new ResponseEntity<>(
            "Written successfully",  HttpStatus.OK);
    }

    @PostMapping("/hazlecast/replMap")
    public ResponseEntity<ReplicatedMap<String, String>> rmWrite() {
        ReplicatedMap<String, String> map = this.client.getReplicatedMap("student1-repl-data");
        map.put("name", "John");
        map.put("age", "23");
        
        return new ResponseEntity<ReplicatedMap<String, String>>(map,  HttpStatus.OK);
    }

    @PostMapping("/hazlecast/set")
    public ResponseEntity<Set<String>> setWrite() {
        Set<String> set = this.client.getSet("places");
        set.add("Mumbai");
        set.add("Bangalore");
        return new ResponseEntity<Set<String>>(set,  HttpStatus.OK);
    }

    @PostMapping("/hazlecast/topic")
    public ResponseEntity<String> topicRead() {
        String topic = "notice";
        String message = "Hello world";
        ITopic<String> itopic = this.client.getTopic("world-topic");
        itopic.publish("Hello to distributed world");
        
        return new ResponseEntity<String>("Published to topic: " + topic + " message: " + message ,  HttpStatus.OK);
    }
}
