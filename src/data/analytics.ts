/**
 * Google Analytics 4 measurement ID ("G-XXXXXXXXXX"). Leave empty to load no analytics at all.
 * The ID is public by design: it appears in every page's HTML.
 */
export const GA_MEASUREMENT_ID = "G-9TG7JEDDCX";

/**
 * The same measurement ID is shared with nk4dev.github.io and other sites, so every event from
 * this site carries site_name with this value. Register "site_name" as an event-scoped custom
 * dimension in GA (Admin → Custom definitions) to filter and compare by it in reports.
 */
export const GA_SITE_NAME = "new-blog";
