package fpoly.datn.ecommerce_website.service.serviceImpl;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson.JacksonFactory;
import fpoly.datn.ecommerce_website.entity.Users;
import fpoly.datn.ecommerce_website.infrastructure.constant.Message;
import fpoly.datn.ecommerce_website.infrastructure.exception.rest.InvalidTokenException;

import java.util.Collections;

public class GoogleTokenVerifier {

    private static final String CLIENT_ID_GOOGLE = "910299676468-6cjt8a57ipkf0hg07gcogvj78b2hmi9t.apps.googleusercontent.com";

    public static Users verifyToken(String tokenId) {
        try {
            JsonFactory jsonFactory = new JacksonFactory();
            NetHttpTransport transport = new NetHttpTransport();
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(transport, jsonFactory)
                    .setAudience(Collections.singletonList(CLIENT_ID_GOOGLE))
                    .build();

            GoogleIdToken idToken = verifier.verify(tokenId);
            if (idToken != null) {
                Payload payload = idToken.getPayload();
                String email = payload.getEmail();
                String name = (String) payload.get("name");
                String picture = (String) payload.get("picture");

                Users user = new Users();
                user.setFullName(name);
                user.setEmail(email);
                return user;
            } else {
                throw new InvalidTokenException(Message.TOKEN_VERIFICATION_FAILED);
            }
        } catch (Exception e) {
            throw new InvalidTokenException(Message.TOKEN_VERIFICATION_FAILED);
        }
    }
}
