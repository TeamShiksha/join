import com.example.eventmanager.model.Event;
import com.example.eventmanager.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
public class EventController {

    @Autowired
    private EventService eventService;

    // Get Event by Slug
    @GetMapping("/{slug}")
    public Event getEventBySlug(@PathVariable String slug) {
        return eventService.getEventBySlug(slug);
    }

    // Search Events by Title or Description
    @GetMapping("/search")
    public List<Event> searchEvents(@RequestParam String query) {
        return eventService.searchEvents(query);
    }

    // Soft Delete
    @DeleteMapping("/{slug}")
    public String softDeleteEvent(@PathVariable String slug) {
        eventService.softDeleteEvent(slug);
        return "Event deleted successfully";
    }

    // Update Event Description
    @PutMapping("/{slug}")
    public Event updateEventDescription(@PathVariable String slug, @RequestBody String description) {
        return eventService.updateEventDescription(slug, description);
    }
}