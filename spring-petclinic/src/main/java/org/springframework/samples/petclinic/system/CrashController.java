/*
 * Copyright 2012-2019 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.springframework.samples.petclinic.system;

// import co.elastic.apm.api.ElasticApm;
// import co.elastic.apm.api.Span;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.context.annotation.PropertySource;
// import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Controller used to showcase what happens when an exception is thrown
 *
 * @author Michael Isvy
 * <p/>
 * Also see how a view that resolves to "error" has been added ("error.html").
 */
@Controller
// @Component
// @PropertySource("classpath:application.properties")
class CrashController {
    Logger logger = LoggerFactory.getLogger(CrashController.class);
    // @Value("${tag_appName}")
    // private String tagAppName;

    // @Value("${tag_Name}")
    // private String tagName;

    // @Value("${isConfigEnable}")
    // private Boolean isConfigEnable;

    @GetMapping("/oups")
    public String triggerException() {
        // if(isConfigEnable){
        //     Span span = ElasticApm.currentSpan();
        //     span.addLabel("_tag_appName", tagAppName);
        //     span.addLabel("_tag_Name", tagName);
        //     span.addLabel("_plugin", "stacktrace");
        // }
        logger.info("Query success called GET /oups");
        throw new RuntimeException("Expected: controller used to showcase what "
                + "happens when an exception is thrown");
    }

}
