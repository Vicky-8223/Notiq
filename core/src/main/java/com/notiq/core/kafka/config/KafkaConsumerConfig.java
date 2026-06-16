//package com.notiq.core.kafka.config;
//
//
//import com.notiq.eventproducer.dto.NotificationEvent;
//import org.apache.kafka.clients.consumer.ConsumerConfig;
//import org.apache.kafka.common.serialization.StringDeserializer;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
//import org.springframework.kafka.core.ConsumerFactory;
//import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
//import org.springframework.kafka.support.serializer.JsonDeserializer;
//
////import java.io.IOException;
//import java.util.HashMap;
//import java.util.Map;
//
//@Configuration
//public class KafkaConsumerConfig {
//    @Bean
//    public ConsumerFactory<String, Object> consumerFactory(){
//        JsonDeserializer<Object> deserializer=new JsonDeserializer<>(Object.class);
//        deserializer.addTrustedPackages("*");
//        Map<String,Object>props=new HashMap<>();
//        props.put(ConsumerConfig.GROUP_ID_CONFIG,"notification-core-group");
//        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
//        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG,JsonDeserializer.class);
//        return new DefaultKafkaConsumerFactory<>(props,new StringDeserializer(),deserializer);
//    }
//    @Bean
//    public ConcurrentKafkaListenerContainerFactory<String,Object>
//          kafkaListenerContainerFactory(){
//        ConcurrentKafkaListenerContainerFactory<String,Object> factory=new ConcurrentKafkaListenerContainerFactory<>();
//        factory.setConsumerFactory(consumerFactory());
//        return factory;
//    }
//}
