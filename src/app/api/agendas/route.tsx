import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import {
    mapDatabaseAgendaToAgenda,
    mapAgendaToDatabaseAgenda,
    mapAgendaItemToDatabaseAgendaItem,
} from '@/lib/database-helpers';
import { Agenda, AgendaItem } from '@/lib/global-interface';

// GET: Fetch agendas (all visible or by id)
export async function GET(req: NextRequest) {
    const supabase = createServerClient();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
        // Fetch single agenda by id
        const { data, error } = await supabase
            .from('agendas')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }
        return NextResponse.json(mapDatabaseAgendaToAgenda(data));
    }

    // Fetch all visible agendas (public, owned, or shared)
    const { data, error } = await supabase
        .from('agendas')
        .select('*');

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data.map(mapDatabaseAgendaToAgenda));
}

// UPSERT: Insert or update agenda (PUT)
export async function PUT(req: NextRequest) {
    const supabase = createServerClient();
    const body = await req.json();
    const agenda = body as Partial<Agenda>;
    const agendaItems = body.agendaItems || [];

    if (!agenda.title || !agenda.ownerId) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const upsertData = mapAgendaToDatabaseAgenda({
        ...agenda,
        id: agenda.id || undefined,
        createdAt: agenda.createdAt || new Date().toISOString(),
        ownerId: agenda.ownerId,
        isPublic: agenda.isPublic || false,
        title: agenda.title,
        description: agenda.description || undefined,
    });

    // 1. Upsert agenda
    const { data: agendaData, error: agendaError } = await supabase
        .from('agendas')
        .upsert(upsertData)
        .select()
        .single();

    if (agendaError) {
        return NextResponse.json({ error: agendaError.message }, { status: 500 });
    }

    // 2. Upsert agenda_items if provided
    if (agendaItems.length > 0) {
        const itemsToUpsert = agendaItems.map((item: AgendaItem) =>
            mapAgendaItemToDatabaseAgendaItem({
                ...item,
                agendaId: agendaData.id,
                startTime: item.startTime,
                endTime: item.endTime,
                createdAt: item.createdAt,
            })
        );

        const { error: itemsError } = await supabase
            .from('agenda_items')
            .upsert(itemsToUpsert);

        if (itemsError) {
            return NextResponse.json({ error: itemsError.message }, { status: 500 });
        }
    }

    // 3. Fetch and return the agenda with its items
    const { data: freshAgendaItems, error: fetchItemsError } = await supabase
        .from('agenda_items')
        .select('*')
        .eq('agenda_id', agendaData.id);

    if (fetchItemsError) {
        return NextResponse.json({ error: fetchItemsError.message }, { status: 500 });
    }

    return NextResponse.json({
        ...mapDatabaseAgendaToAgenda(agendaData),
        agendaItems: freshAgendaItems || [],
    });
}

// DELETE: Remove agenda by id
export async function DELETE(req: NextRequest) {
    const supabase = createServerClient();
    const { searchParams } = new URL(req.url);
    let id = searchParams.get('id');

    if (!id) {
        try {
            const body = await req.json();
            id = body.id;
        } catch {
            // ignore
        }
    }

    if (!id) {
        return NextResponse.json({ error: 'Missing agenda id' }, { status: 400 });
    }

    const { error } = await supabase
        .from('agendas')
        .delete()
        .eq('id', id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
