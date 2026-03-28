package api;

import com.amazonaws.serverless.exceptions.ContainerInitializationException;
import com.amazonaws.serverless.proxy.model.AwsProxyRequest;
import com.amazonaws.serverless.proxy.model.AwsProxyResponse;
import com.amazonaws.serverless.proxy.spring.SpringBootLambdaContainerHandler;
import com.library.LibraryManagementApplication;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

public class index extends HttpServlet {
    private static SpringBootLambdaContainerHandler<AwsProxyRequest, AwsProxyResponse> handler;

    static {
        try {
            // Initialize the Spring Boot application using the bridge
            handler = SpringBootLambdaContainerHandler.getAwsProxyHandler(LibraryManagementApplication.class);
        } catch (ContainerInitializationException e) {
            e.printStackTrace();
            throw new RuntimeException("Could not initialize Spring Boot application", e);
        }
    }

    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        // The bridge handles the routing from HttpServlet to Spring Controllers
        // Vercel routes /api/* to this servlet, and the bridge takes over.
        // We use the 'handler.proxy(req, resp)' if available, or a similar method.
        
        // Note: aws-serverless-java-container 2.x supports Jakarta EE (Spring Boot 3)
        try {
            handler.proxyStream(req.getInputStream(), resp.getOutputStream(), null);
        } catch (Exception e) {
            resp.setStatus(500);
            resp.getWriter().write("Internal Server Error: " + e.getMessage());
        }
    }
}
