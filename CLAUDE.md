# Project context

I want to make an app for scanning receipts at restaurants and bars and identifying the items so that a group of people can split it. Once someone takes a photo of the receipt, the list of the items will become ui components that people can pick. Important, the person that scanned the receipt creates a session and he can show a qr code to that session to the other people and it will take them either to the app if they have it or to the browser where everyone will be able to see and pick in real time. If one person picks one item, that is blocked for the others. The system does not handle the payment, only the split. It should take into account the service fee, so it has to identify the percentage charged on the total amount and use that to calculate what each one will pay. It should be on Android and IOs. 

## Tech stack & conventions
React + NextJs

---
Workflow rules for the agent are in `README.md`; your live controls are in `control.yml`.
