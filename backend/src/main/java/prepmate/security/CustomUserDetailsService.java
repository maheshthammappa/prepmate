// ─────────────────────────────────────────────────────────────────────────────
// security/CustomUserDetailsService.java
//
// PURPOSE:
//   A Spring Security service that loads user-specific data from the database
//   during the authentication process.
//
// DATA FLOW:
//   1. Spring Security needs to verify a user's credentials (or token).
//   2. It calls `loadUserByUsername(username)`.
//   3. This service queries the `UserRepository` to find the user in the database.
//   4. It returns a Spring `UserDetails` object which Spring Security uses to
//      grant or deny access.
// ─────────────────────────────────────────────────────────────────────────────
package prepmate.security;

import prepmate.auth.User;
import prepmate.auth.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(usernameOrEmail)
                .orElseGet(() -> userRepository.findByEmail(usernameOrEmail)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found with username or email: " + usernameOrEmail)));

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                new ArrayList<>()
        );
    }
}
