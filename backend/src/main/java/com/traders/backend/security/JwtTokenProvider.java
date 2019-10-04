package com.traders.backend.security;

import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtTokenProvider {

    // THESE FILEDS WILL BE MOVED TO application_properties.
    // later on we should store it in a safer place.
    @Value("${traders.APP_SECRET}")
    private String APP_SECRET;
    @Value("${traders.EXPIRES_IN}")
    private long EXPIRES_IN;

    public String generateJwtToken(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Date expireDate = new Date(new Date().getTime() + EXPIRES_IN);
        return Jwts.builder().setSubject(userPrincipal.get_id()).setIssuedAt(new Date())
                .setExpiration(expireDate).signWith(SignatureAlgorithm.HS512, APP_SECRET).compact();
    }

    public String getUserIdFromJwt(String token) {
        Claims claims = Jwts.parser().setSigningKey(APP_SECRET).parseClaimsJws(token).getBody();
        return claims.getSubject();
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(APP_SECRET).parseClaimsJws(authToken);
            return true;
        }
        catch(SignatureException e){
            return false;
        }
        catch(MalformedJwtException e) {
            return false;
        }
        catch(ExpiredJwtException e) {
            return false;
        }
        catch(UnsupportedJwtException e){
            return false;
        }
        catch(IllegalArgumentException e){
            return false;
        }
    }
}
