# Ayana

**Ayana** is a simple AI assistant that notices when someone isn’t doing well, responds gently, and checks in again later. It’s meant to support people during difficult moments, especially when they don’t ask for help.

---

## ✍️ What Ayana Does

Ayana quietly monitors how people express themselves through writing — in a journal, chatbox, or workspace.  
When it detects signs of emotional distress, it offers support. It could suggest a breathing exercise, offer a short check-in, or ask if the person wants to reach out to someone they trust.  
It doesn’t replace therapy. It doesn’t diagnose. It simply notices, responds, and stays close.

---

## 📸 Screens (Preview Coming Soon)

We’ll include UI images here soon, including:

- Message detection and response  
- Breathing guide  
- Follow-up scheduling  
- Trusted contact alert  
- Ayana’s “thinking” process (e.g., detecting emotion, choosing response)

---

## ⚙️ How Ayana Works in the Real World

Ayana runs quietly in tools people already use — like journaling apps, messaging platforms, or wellness dashboards.

### Real-world flow:

1. **A person writes something like**  
   _“I’m tired of pretending I’m okay.”_

2. **Ayana reads it** using IBM watsonx’s NLP tools to detect distress based on tone and phrasing.

3. **Ayana classifies the moment**  
   It decides whether it’s burnout, anxiety, hopelessness, or something else.

4. **It acts**  
   It suggests a small supportive step, like breathing together or offering a kind message.

5. **It remembers**  
   It checks in later, even if the user didn’t reply the first time.

6. **It asks for consent to escalate**  
   If the distress is high, it offers to notify a trusted contact.

---

## 🧠 How Ayana Uses IBM Watsonx Agentic AI

Ayana is built around **agentic AI principles** using IBM watsonx. That means it doesn’t just respond — it decides when and how to act, based on what it sees.

### How it works behind the scenes:

| Agent Function | Powered by |
|----------------|------------|
| **Detection** – reads natural input and detects distress | `watsonx.ai` large language models for sentiment and emotion analysis |
| **Classification** – tags the type and level of emotional strain | Fine-tuned NLP model on watsonx.ai |
| **Decision-making** – chooses response strategy (calming vs. escalate) | Simple agent logic + orchestration through IBM Cloud Functions |
| **Response** – sends a message, starts breathing session, or prompts for human contact | Generated and routed through IBM orchestration layers |
| **Follow-up scheduling** – sets future check-in without prompt | Persistent agent memory and task flow manager |

Ayana operates like a real agent — it observes, reasons, decides, and takes action, using IBM watsonx as its core engine.

---

## 🎯 Use Case

Ayana is built for people who:

- Struggle to ask for help  
- Don’t want to open a therapy app when they’re overwhelmed  
- Need small moments of comfort, not clinical advice  
- Prefer something that notices, not something that waits

This includes:
- Students
- Remote workers
- People in therapy between sessions

---

## 💬 Why This Matters

Ayana came from a real story.  
The person building it lost a friend to suicide—someone who didn’t ask for help.  
Now, Ayana is here to be the support that person never got.

---

## ✅ Status

This is a working simulation for a hackathon demo.  
The behavior is modeled using Gemini AI for now, but the architecture is built for **IBM watsonx agentic AI**.

---

## 📁 Demo Assets (coming soon)

- [ ] Screenshot of initial response  
- [ ] Breathing guide screen  
- [ ] Check-in scheduling  
- [ ] Escalation prompt  
- [ ] Agent logic visual (how it reasons and acts)

---

## 📌 Note

Ayana is not a therapist.  
It’s a companion.  
People in crisis should always reach out to someone they trust or contact emergency services.

---
