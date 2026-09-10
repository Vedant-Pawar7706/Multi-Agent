import io
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

class PDFGuideGenerator:
    """
    ReportLab Professional Travel Guide PDF Exporter for VoyageAI.
    Renders cover page, itinerary timelines, budget tables, packing lists, and sources.
    """
    @staticmethod
    def generate_pdf(itinerary_data: dict) -> bytes:
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36
        )

        styles = getSampleStyleSheet()
        
        # Primary aesthetic palette
        PRIMARY = colors.HexColor("#0F172A")    # Dark slate
        ACCENT = colors.HexColor("#4F46E5")     # Indigo accent
        BG_LIGHT = colors.HexColor("#F8FAFC")   # Light gray
        TEXT_DARK = colors.HexColor("#1E293B")  # Dark text
        MUTED = colors.HexColor("#64748B")      # Muted gray

        title_style = ParagraphStyle(
            "CoverTitle",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=28,
            leading=34,
            textColor=PRIMARY,
            alignment=1, # Centered
            spaceAfter=12
        )
        subtitle_style = ParagraphStyle(
            "CoverSubtitle",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=14,
            leading=18,
            textColor=MUTED,
            alignment=1,
            spaceAfter=24
        )
        h1_style = ParagraphStyle(
            "SectionH1",
            parent=styles["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=18,
            leading=22,
            textColor=ACCENT,
            spaceBefore=14,
            spaceAfter=8
        )
        h2_style = ParagraphStyle(
            "SectionH2",
            parent=styles["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=13,
            leading=16,
            textColor=PRIMARY,
            spaceBefore=10,
            spaceAfter=4
        )
        body_style = ParagraphStyle(
            "BodyDark",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=10,
            leading=14,
            textColor=TEXT_DARK,
            spaceAfter=6
        )

        story = []

        meta = itinerary_data.get("meta", {})
        dest = meta.get("destination", "Travel Guide")
        days = meta.get("duration_days", 5)
        travelers = meta.get("travelers", 2)
        curr = meta.get("currency_symbol", "₹")
        total_cost = meta.get("estimated_cost", 0)

        # ----------------------------------------------------
        # 1. COVER / HEADER BANNER
        # ----------------------------------------------------
        story.append(Spacer(1, 20))
        story.append(Paragraph(f"VoyageAI Travel Master Guide", subtitle_style))
        story.append(Paragraph(f"{dest}", title_style))
        story.append(Paragraph(f"{days} Days  •  {travelers} Travelers  •  Total Estimate: {curr} {total_cost:,.2f}", subtitle_style))
        story.append(HRFlowable(width="100%", thickness=2, color=ACCENT, spaceBefore=10, spaceAfter=20))

        # ----------------------------------------------------
        # 2. TRIP OVERVIEW
        # ----------------------------------------------------
        story.append(Paragraph("1. Trip Overview", h1_style))
        overview_text = itinerary_data.get("trip_overview", "A curated personalized travel guide.")
        story.append(Paragraph(overview_text, body_style))
        story.append(Spacer(1, 10))

        # ----------------------------------------------------
        # 3. DESTINATION SNAPSHOT
        # ----------------------------------------------------
        snap = itinerary_data.get("destination_snapshot", {})
        story.append(Paragraph("2. Destination Snapshot", h1_style))
        story.append(Paragraph(f"<b>Overview:</b> {snap.get('overview', '')}", body_style))
        story.append(Paragraph(f"<b>Best Time to Visit:</b> {snap.get('best_time_to_visit', '')}", body_style))
        story.append(Spacer(1, 10))

        # ----------------------------------------------------
        # 4. DAY-BY-DAY ITINERARY
        # ----------------------------------------------------
        story.append(Paragraph("3. Day-by-Day Itinerary", h1_style))
        itinerary_days = itinerary_data.get("itinerary", [])
        
        for d in itinerary_days:
            day_num = d.get("day", 1)
            theme = d.get("theme", f"Day {day_num}")
            story.append(Paragraph(f"<b>{theme}</b>", h2_style))
            
            # Table of day activities
            table_data = [["Time", "Activity", "Location", "Duration"]]
            for act in d.get("morning", []) + d.get("afternoon", []) + d.get("evening", []):
                table_data.append([
                    act.get("time", ""),
                    act.get("activity", ""),
                    act.get("location", ""),
                    act.get("duration", "")
                ])
                
            if len(table_data) > 1:
                t = Table(table_data, colWidths=[1.1*inch, 3.2*inch, 1.8*inch, 1.1*inch])
                t.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), BG_LIGHT),
                    ('TEXTCOLOR', (0, 0), (-1, 0), PRIMARY),
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('FONTSIZE', (0, 0), (-1, -1), 9),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
                    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0"))
                ]))
                story.append(t)
                story.append(Spacer(1, 8))

        # ----------------------------------------------------
        # 5. FINANCIAL BUDGET BREAKDOWN
        # ----------------------------------------------------
        story.append(Spacer(1, 10))
        story.append(Paragraph("4. Financial Budget Breakdown", h1_style))
        bud = itinerary_data.get("budget_breakdown", {})
        b_cat = bud.get("budget", {})
        
        bud_table_data = [
            ["Category", "Estimated Allocation"],
            ["Flights & Long Transit", f"{curr} {b_cat.get('flights', 0):,.2f}"],
            ["Accommodations & Hotels", f"{curr} {b_cat.get('hotel', 0):,.2f}"],
            ["Food & Dining", f"{curr} {b_cat.get('food', 0):,.2f}"],
            ["Local Transportation", f"{curr} {b_cat.get('transport', 0):,.2f}"],
            ["Attractions & Activities", f"{curr} {b_cat.get('activities', 0):,.2f}"],
            ["Emergency Buffer", f"{curr} {b_cat.get('emergency_buffer', 0):,.2f}"],
            ["Total Estimated Cost", f"{curr} {b_cat.get('total', total_cost):,.2f}"]
        ]
        
        bt = Table(bud_table_data, colWidths=[3.6*inch, 3.6*inch])
        bt.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
            ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
            ('BACKGROUND', (0, -1), (-1, -1), BG_LIGHT)
        ]))
        story.append(bt)
        story.append(Spacer(1, 14))

        # ----------------------------------------------------
        # 6. PACKING & TRAVEL TIPS
        # ----------------------------------------------------
        story.append(Paragraph("5. Personal Packing Checklist", h1_style))
        packing = itinerary_data.get("packing_checklist", [])
        for p_cat in packing:
            items_str = ", ".join(p_cat.get("items", []))
            story.append(Paragraph(f"<b>{p_cat.get('category')}:</b> {items_str}", body_style))

        story.append(Spacer(1, 14))
        story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#E2E8F0"), spaceBefore=10, spaceAfter=10))
        story.append(Paragraph("Generated by MyTrip Multi-Agent System. Estimated prices — actual rates may vary.", subtitle_style))

        doc.build(story)
        pdf_bytes = buffer.getvalue()
        buffer.close()
        return pdf_bytes
