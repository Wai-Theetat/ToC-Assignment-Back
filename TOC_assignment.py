import re

def main(text_log: str):
    try:
        #จาก assignmet วันเกิด จะขึ้นต้นด้วย (DOB:) เสมอ
        #จึงสามารถใช้เป็นจุดแบ่ง แบ่งข้อมูลออกเป็นสองส่วน
        match = re.search(r'(.*?) DOB:(.*)', text_log, re.DOTALL)

        #part 1 มีข้อมูลได้แก่ บัตรเครดิต อีเมล และเบอร์โทรศัพท์
        part1 = match.group(1)
        credit_card, email, tel = part1.split()

        #part 2 มีข้อมูลได้แก่ วันเดือนปีเกิด และที่อยู่
        part2 = match.group(2)

        #จาก assignmet ที่อยู่ จะขึ้นต้นด้วย (Address:) เสมอ
        #จึงสามารถใช้เป็นจุดแบ่ง แบ่งข้อมูลออกเป็นสองส่วน คือ วันเดือนปีเกิด และที่อยู่
        part2_split = re.search(r'(.*?) Address: (.*)', part2, re.DOTALL)

        date_of_birth = part2_split.group(1)
        address = part2_split.group(2)

        return f"{censor_credit_card(credit_card)} {censor_mail(email)} {censor_tel(tel)} {censor_DOB(date_of_birth)} {censor_address(address)}"
    except Exception as error:
        return f"Error : {error}"


def censor_credit_card(credit_card):
    
    #จาก assignment บัตรเครดิต จะมาในรูปแบบ (ตัวเลข 4 ตัว - ตัวเลข 4 ตัว - ตัวเลข 4 ตัว - ตัวเลข 4 ตัว)
    #ผลลัพธ์ที่ต้องการคือเซ็นเซอร์ตัวเลข 3 กลุ่มแรก เหลือไว้แค่ตัวเลขกลุ่มสุดท้าย

    #โดยฟังก์ชัน regex ที่ใช้คือ re.sub(pattern, replacement, string)
    #ใน pattern parameter เราจะได้ตัวเลข 4 กลุ่ม 
    #โดยใช้ regex (\d{4}) ซึ่งหมายถึง ตัวเลข 4 ตัว
    #ในส่วนของ replacement parameter
    #เราจะคืนค่ากับเป็น string 'XXXX-XXXX-XXXX-' แล้วต่อด้วยกลุ่มที่ 4
    #แล้วคืนค่า newFormat ให้กับ caller

    newFormat = re.sub(r'(\d{4})-(\d{4})-(\d{4})-(\d{4})', r'XXXX-XXXX-XXXX-\4', credit_card)
    return f"{newFormat}"

def censor_tel(tel):
    
    #จาก assignment เบอร์โทรศัพท์ จะมาในรูปแบบ (ตัวเลข 3 ตัว - ตัวเลข 3 ตัว - ตัวเลข 4 ตัว)
    #ผลลัพธ์ที่ต้องการคือเซ็นเซอร์ตัวเลข 2 กลุ่มแรก เหลือไว้แค่ตัวเลขกลุ่มสุดท้าย

    #โดยฟังก์ชัน regex ที่ใช้คือ re.sub(pattern, replacement, string)
    #ใน pattern parameter เราจะได้ตัวเลข 3 กลุ่ม 
    #โดยใช้ regex (\d{3}) ซึ่งหมายถึง ตัวเลข 3 ตัว
    #และ (\d{4}) ซึ่งหมายถึง ตัวเลข 4 ตัว

    #ในส่วนของ replacement parameter
    #เราจะคืนค่ากับเป็น string 'XXX-XXX-' แล้วต่อด้วยกลุ่มที่ 3
    #แล้วคืนค่า newFormat ให้กับ caller
    
    newFormat = re.sub(r'(\d{3})-(\d{3})-(\d{4})', r'XXX-XXX-\3', tel)
    return f"{newFormat}"

def censor_mail(text):
    pattern = r'([\w.+-])([\w.+-]+)([\w.+-])@([\w.-]+\.[\w.]+)'
    return re.sub(pattern, lambda m: f'{m.group(1)}{"X"*len(m.group(2))}{m.group(3)}@{m.group(4)}', text)

def censor_DOB(DOB):
    #จาก assignment วันเกิด จะมาในรูปแบบ : วัน(ตัวเลข)/เดือน(ตัวเลข)/ปี(ตัวเลข) เช่น 25/12/2549
    #ผลลัพธ์ที่ต้องการคือ XX/XX/(ตัวเลขสองตัวแรกของปีที่ไม่เซ็นเซอร์)XX 

    #โดยฟังก์ชัน regex ที่ใช้คือ re.sub(pattern, replacement, string)
    #ใน pattern parameter เราจะได้ตัวเลข 4 กลุ่ม 
    #โดยใช้ regex r'(\d{1,2})/(\d{1,2})/(\d{2})(\d+)'
    #โดยแต่ละตัวมีความหมายดังนี้
    #(\d{1,2}) หมายถึง ตัวเลข 1 หรือ 2 ตัว
    #(\d{2}) หมายถึง ตัวเลข 2 ตัว
    #(\d+) หมายถึง ตัวเลข 1 หรือมากกว่า

    #ในส่วนของ replacement parameter 
    #เราสามารถใช้ XX/XX/\3XX แบบปกติได้ 
    #แต่ในกรณีที่ input ของปีเกิดมีตัวเลขมากกว่า 4 ตัว เราจึงสร้าง helper function เพื่อช่วยในการสร้าง string ใหม่
    def censor_DOB(match):
        #จาก regex เราจะได้ตัวเลข 4 กลุ่ม แต่จะโฟกัสในส่วนของปีเกิดอย่างเดียว
        
        third = match.group(3)
        fourth = match.group(4)
        #ในส่วนของ วัน และเดือน เราจะคืนค่าเป็น XX/XX/ 
        #และในส่วนของปี จาก assignment เราจะคไม่เซ็นเซอร์ตัวเลข 2 ตัวแรก และส่วนที่เหลือจะถูกเซ็นเซอร์ด้วย X
        return f"XX/XX/{third}{len(fourth) * 'X'}"
    
    newFormat = re.sub(r'(\d{1,2})/(\d{1,2})/(\d{2})(\d+)', censor_DOB, DOB)
    #เพิ่ม string DOB: กลับเข้าไปเหมือนเดิม เนื่องจากตัดออกไปก่อนเข้าฟังก์ชัน
    return f"DOB:{newFormat}"

def censor_address(address):
    #จาก assignment address จะมาในรูปแบบ : Address: บ้านเลขที่ ซอย ถนน แขวง เขต จังหวัด และอื่นๆ
    #เช่น 689 ซอยลาดกระบัง 19 ถนนลาดกระบัง แขวงลาดกระบัง เขตลำดกระบัง กรุงเทพฯ"

    #สิ่งที่ต้องการคือเซ็นเซอร์บ้านเลขที่เท่านั้น ส่วนอื่นๆไม่ต้องเซ็นเซอร์
    #โดยฟังก์ชัน regex ที่ใช้คือ re.sub(pattern, replacement, string)
    #ใน pattern parameter เราจะได้ตัวเลข 4 กลุ่ม 
    #โดยใช้ regex r'\d+(?:/\d+)?' count=1
    #โดยมีความหมายคือ
    #\d+ หมายถึง ตัวเลข 1 หรือมากกว่า
    #(?:/\d+)? หมายถึง optional group ที่หมายถึง "อาจจะมี / ตามด้วยตัวเลขอีก 1 หรือมากกว่า เช้น 34/7"

    #จาก regex เราจะได้ตัวเลขบ้านเลขที่ แต่ตามตัวอย่างด้านบนที่อาจมีตัวอักษรที่ไม่ใช่ตัวเลขปะปนมาด้วย
    #เราจะใช้ helper function mask_digits เพื่อช่วยในการสร้าง string ใหม่
    def mask_digits(match):
        #ใช้ regex แบบ simple คือ re.sub(r'\d', 'X', match.group()) เพื่อเซ็นเซอร์ตัวเลขทั้งหมดในบ้านเลขที่
        return re.sub(r'\d', 'X', match.group())
    
    newformat = re.sub(r'\d+(?:/\d+)?', mask_digits, address, count=1)
    #เพิ่ม string Address: กลับเข้าไปเหมือนเดิม เนื่องจากตัดออกไปก่อนเข้าฟังก์ชัน
    return f"Address: {newformat}"


if __name__ == "__main__":
    text_log : str = "1234-5678-9012-3456 somchai.d@company.com 093-245-7894 DOB:25/12/2549 Address: 689 ซอยลาดกระบัง 19 ถนนลาดกระบัง แขวงลาดกระบัง เขตลำดกระบัง กรุงเทพฯ"
    result = main(text_log)
    print(result)