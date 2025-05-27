import { AgendaItem } from "@/lib/global-interface";
import moment from "moment";

export function generatedAgendaItems(
    tripStartDate: Date,
    now: string,
    generatedAgendaId?: string,
): AgendaItem[] {
    // Use moment for date manipulation
    const base = moment(tripStartDate);

    const items: Omit<AgendaItem, 'id' | 'agendaId' | 'createdAt'>[] = [
        {
            title: "Day 1: Tokyo Arrival",
            description: "Arrive at Narita/Haneda Airport and transfer to your hotel in Shinjuku.",
            startTime: base.clone().hour(8).minute(0).format("YYYY-MM-DDTHH:mm"),
            endTime: base.clone().hour(11).minute(0).format("YYYY-MM-DDTHH:mm"),
            location: "Shinjuku, Tokyo",
        },
        {
            title: "Day 1: Lunch at Local Izakaya",
            description: "Enjoy a traditional Japanese lunch at a cozy izakaya in Shinjuku.",
            startTime: base.clone().hour(12).minute(0).format("YYYY-MM-DDTHH:mm"),
            endTime: base.clone().hour(13).minute(0).format("YYYY-MM-DDTHH:mm"),
            location: "Shinjuku, Tokyo",
        },
        {
            title: "Day 1: Shinjuku Gyoen National Garden",
            description: "Stroll through the beautiful Shinjuku Gyoen National Garden and relax after your flight.",
            startTime: base.clone().hour(13).minute(30).format("YYYY-MM-DDTHH:mm"),
            endTime: base.clone().hour(15).minute(0).format("YYYY-MM-DDTHH:mm"),
            location: "Shinjuku Gyoen, Tokyo",
        },
        {
            title: "Day 1: Explore Omoide Yokocho",
            description: "Wander through Omoide Yokocho ('Piss Alley'), famous for its tiny bars and yakitori.",
            startTime: base.clone().hour(17).minute(0).format("YYYY-MM-DDTHH:mm"),
            endTime: base.clone().hour(18).minute(30).format("YYYY-MM-DDTHH:mm"),
            location: "Omoide Yokocho, Shinjuku",
        },
        {
            title: "Day 1: Tokyo Metropolitan Government Building",
            description: "Visit the observation deck for panoramic city views.",
            startTime: base.clone().hour(19).minute(0).format("YYYY-MM-DDTHH:mm"),
            endTime: base.clone().hour(20).minute(0).format("YYYY-MM-DDTHH:mm"),
            location: "Tokyo Metropolitan Government Building",
        },
        {
            title: "Day 1: Evening Walk in Kabukicho",
            description: "Take an evening stroll through the vibrant Kabukicho district, famous for its neon lights and entertainment.",
            startTime: base.clone().hour(20).minute(0).format("YYYY-MM-DDTHH:mm"),
            endTime: base.clone().hour(21).minute(0).format("YYYY-MM-DDTHH:mm"),
            location: "Kabukicho, Shinjuku, Tokyo",
        },
        {
            title: "Day 2: Culture & Pop in Shibuya & Harajuku",
            description: "Morning: Visit Meiji Jingu Shrine. Afternoon: Explore Takeshita Street in Harajuku, try unique street food. Late Afternoon: Walk the iconic Shibuya Scramble Crossing and visit the Hachiko statue. Evening: Dinner and shopping in Shibuya.",
            startTime: base.clone().add(1, "day").hour(9).minute(0).format("YYYY-MM-DDTHH:mm"),
            endTime: base.clone().add(1, "day").hour(10).minute(0).format("YYYY-MM-DDTHH:mm"),
            location: "Shibuya & Harajuku, Tokyo",
        },
        {
            title: "Day 2: Meiji Jingu Shrine",
            description: "Visit the peaceful Meiji Jingu Shrine, dedicated to Emperor Meiji and Empress Shoken.",
            startTime: base.clone().add(1, "day").hour(10).minute(0).format("YYYY-MM-DDTHH:mm"),
            endTime: base.clone().add(1, "day").hour(11).minute(0).format("YYYY-MM-DDTHH:mm"),
            location: "Meiji Jingu, Shibuya, Tokyo",
        },
        {
            title: "Day 2: Harajuku & Takeshita Street",
            description: "Explore Takeshita Street in Harajuku, known for its unique fashion and street food.",
            startTime: base.clone().add(1, "day").hour(11).minute(30).format("YYYY-MM-DDTHH:mm"),
            endTime: base.clone().add(1, "day").hour(14).minute(0).format("YYYY-MM-DDTHH:mm"),
            location: "Harajuku, Tokyo",
        },
        {
            title: "Day 2: Shibuya Scramble & Hachiko",
            description: "Walk the iconic Shibuya Scramble Crossing and visit the Hachiko statue.",
            startTime: base.clone().add(1, "day").hour(14).minute(30).format("YYYY-MM-DDTHH:mm"),
            endTime: base.clone().add(1, "day").hour(16).minute(0).format("YYYY-MM-DDTHH:mm"),
            location: "Shibuya, Tokyo",
        },
        {
            title: "Day 2: Shibuya Shopping & Dinner",
            description: "Enjoy dinner and shopping in the vibrant Shibuya district.",
            startTime: base.clone().add(1, "day").hour(17).minute(0).format("YYYY-MM-DDTHH:mm"),
            endTime: base.clone().add(1, "day").hour(20).minute(0).format("YYYY-MM-DDTHH:mm"),
            location: "Shibuya, Tokyo",
        },
        {
            title: "Day 3: Tradition in Asakusa & Sumida River",
            description: "Morning: Explore Senso-ji Temple and Nakamise-dori Street in Asakusa. Afternoon: Take a Sumida River cruise. Late Afternoon: Visit the Tokyo Skytree for stunning views. Evening: Dinner in Asakusa.",
            startTime: base.clone().add(2, "day").hour(9).minute(30).format("YYYY-MM-DDTHH:mm"),
            endTime: base.clone().add(2, "day").hour(21).minute(0).format("YYYY-MM-DDTHH:mm"),
            location: "Asakusa, Tokyo",
        },
        {
            title: "Day 3: Senso-ji Temple & Nakamise-dori",
            description: "Morning: Explore the historic Senso-ji Temple and browse the traditional shops on Nakamise-dori Street in Asakusa.",
            startTime: base.clone().add(2, "day").hour(9).minute(30).format("YYYY-MM-DDTHH:mm"),
            endTime: base.clone().add(2, "day").hour(12).minute(30).format("YYYY-MM-DDTHH:mm"),
            location: "Asakusa, Tokyo",
        },
        {
            title: "Day 3: Lunch & Sumida River Cruise",
            description: "Afternoon: Enjoy lunch in Asakusa followed by a scenic Sumida River cruise.",
            startTime: base.clone().add(2, "day").hour(12).minute(30).format("YYYY-MM-DDTHH:mm"),
            endTime: base.clone().add(2, "day").hour(15).minute(0).format("YYYY-MM-DDTHH:mm"),
            location: "Asakusa & Sumida River, Tokyo",
        },
        {
            title: "Day 3: Tokyo Skytree",
            description: "Late Afternoon: Visit the Tokyo Skytree for stunning panoramic views of the city.",
            startTime: base.clone().add(2, "day").hour(15).minute(30).format("YYYY-MM-DDTHH:mm"),
            endTime: base.clone().add(2, "day").hour(18).minute(0).format("YYYY-MM-DDTHH:mm"),
            location: "Tokyo Skytree, Sumida, Tokyo",
        },
        {
            title: "Day 3: Asakusa Evening & Dinner",
            description: "Evening: Explore more of Asakusa or enjoy a relaxing dinner in the area.",
            startTime: base.clone().add(2, "day").hour(18).minute(30).format("YYYY-MM-DDTHH:mm"),
            endTime: base.clone().add(2, "day").hour(21).minute(0).format("YYYY-MM-DDTHH:mm"),
            location: "Asakusa, Tokyo",
        },
        {
            title: "Day 4: Day Trip to Hakone",
            description: "Full day trip to Hakone. Enjoy a scenic boat cruise on Lake Ashi, take the Hakone Ropeway (see volcanic hot springs), visit the Hakone Open-Air Museum. Hope for views of Mount Fuji (weather permitting). Evening: Return to Tokyo.",
            startTime: base.clone().add(3, "day").hour(8).minute(0).format("YYYY-MM-DDTHH:mm"),
            endTime: base.clone().add(3, "day").hour(19).minute(0).format("YYYY-MM-DDTHH:mm"),
            location: "Hakone",
        },
        {
            title: "Day 4: Evening Relaxation in Tokyo",
            description: "Relax at the hotel or explore the local area near your accommodation after returning from Hakone.",
            startTime: base.clone().add(3, "day").hour(19).minute(30).format("YYYY-MM-DDTHH:mm"),
            endTime: base.clone().add(3, "day").hour(20).minute(30).format("YYYY-MM-DDTHH:mm"),
            location: "Tokyo",
        },
        {
            title: "Day 4: Optional Late Dinner",
            description: "Have a late dinner at a restaurant of your choice in Tokyo.",
            startTime: base.clone().add(3, "day").hour(20).minute(30).format("YYYY-MM-DDTHH:mm"),
            endTime: base.clone().add(3, "day").hour(21).minute(30).format("YYYY-MM-DDTHH:mm"),
            location: "Tokyo",
        },
        {
            title: "Day 5: Ueno Park, Museums & Departure",
            description: "Morning: Visit Ueno Park, explore one of its museums (e.g., Tokyo National Museum). Afternoon: Last-minute souvenir shopping at Ameya-Yokocho Market. Transfer to Narita/Haneda Airport for departure.",
            startTime: base.clone().add(4, "day").hour(9).minute(0).format("YYYY-MM-DDTHH:mm"),
            endTime: base.clone().add(4, "day").hour(17).minute(0).format("YYYY-MM-DDTHH:mm"),
            location: "Ueno, Tokyo",
        },
        {
            title: "Day 5: Quick Break",
            description: "A short break before the farewell dinner.",
            startTime: base.clone().add(4, "day").hour(17).minute(0).format("YYYY-MM-DDTHH:mm"),
            endTime: base.clone().add(4, "day").hour(17).minute(30).format("YYYY-MM-DDTHH:mm"),
            location: "Ueno or near Airport",
        },
        {
            title: "Day 5: Farewell Dinner",
            description: "Enjoy a final Japanese dinner at a restaurant of your choice before heading to the airport.",
            startTime: base.clone().add(4, "day").hour(17).minute(30).format("YYYY-MM-DDTHH:mm"),
            endTime: base.clone().add(4, "day").hour(19).minute(0).format("YYYY-MM-DDTHH:mm"),
            location: "Narita/Haneda Airport or nearby",
        },
    ];

    const agendaItems = items.map((item) => {
        return {
            ...item,
            id: "",
            agendaId: generatedAgendaId || "",
            createdAt: now,
        };
    });

    return agendaItems;
}
