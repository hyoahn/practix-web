/**
 * Practix Pulse Relay
 * Global real-time event aggregation via Supabase.
 */

const RELAY_CONFIG = {
    url: 'YOUR_SUPABASE_URL',
    key: 'YOUR_SUPABASE_ANON_KEY',
    table: 'practix_events'
};

let supabaseClient = null;

/**
 * Initialize the Relay
 */
async function initRelay() {
    if (RELAY_CONFIG.url === 'YOUR_SUPABASE_URL') {
        console.warn('📡 Pulse Relay: Credentials missing. Running in local-only mode.');
        return;
    }

    // Load SDK dynamically if missing
    if (!window.supabase) {
        await new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
            script.onload = resolve;
            document.head.appendChild(script);
        });
    }

    if (window.supabase) {
        supabaseClient = window.supabase.createClient(RELAY_CONFIG.url, RELAY_CONFIG.key);
        console.log('📡 Pulse Relay: Connected to Supabase.');
    } else {
        console.error('📡 Pulse Relay: Supabase SDK failed to load.');
    }
}

/**
 * Broadcast an event to the global relay
 */
async function broadcastEvent(eventName, params = {}) {
    console.log(`📡 Relaying: ${eventName}`, params);

    if (!supabaseClient) return;

    try {
        const { error } = await supabaseClient
            .from(RELAY_CONFIG.table)
            .insert([
                {
                    event_name: eventName,
                    params: params,
                    location: window.location.pathname,
                    created_at: new Date().toISOString()
                }
            ]);

        if (error) throw error;
    } catch (err) {
        console.error('📡 Relay broadcast failed:', err);
    }
}

/**
 * Subscribe to the live event stream (for Dashboard)
 */
function subscribeToEvents(onEvent) {
    if (!supabaseClient) return;

    return supabaseClient
        .channel('public:practix_events')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: RELAY_CONFIG.table }, payload => {
            onEvent(payload.new);
        })
        .subscribe();
}

/**
 * Fetch historical counts (for Dashboard load)
 * Supports filtering by params (e.g. { wallpaper_name: 'Desmos God Mode' })
 */
async function getEventCounts(eventName, filters = {}) {
    if (!supabaseClient) return 0;

    let query = supabaseClient
        .from(RELAY_CONFIG.table)
        .select('*', { count: 'exact', head: true })
        .eq('event_name', eventName);

    // Apply filters to params JSON column
    for (const [key, value] of Object.entries(filters)) {
        query = query.contains('params', { [key]: value });
    }

    const { count, error } = await query;
    return error ? 0 : count;
}

// Auto-init on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRelay);
} else {
    initRelay();
}

window.PulseRelay = {
    broadcast: broadcastEvent,
    subscribe: subscribeToEvents,
    getCounts: getEventCounts
};
