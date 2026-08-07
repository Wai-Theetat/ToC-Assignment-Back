import re
#claude code generate
def main(text_log: str):
    try:
        # จากโจทย์ วันเดือนปีเกิดจะเริ่มด้วย 'DOB:' เสมอ
        # จึงใช้เป็นจุดแบ่งข้อมูลออกเป็นสองส่วน
        match = re.search(r'(.*?) DOB:(.*)', text_log, re.DOTALL)

        # ส่วนที่ 1 จะประกอบด้วยบัตรเครดิต อีเมล และเบอร์โทร
        part1 = match.group(1)
        credit_card, email, tel = part1.split()

        # ส่วนที่ 2 จะประกอบด้วยวันเดือนปีเกิดและที่อยู่
        part2 = match.group(2)

        # จากโจทย์ ที่อยู่จะเริ่มด้วย 'Address:'
        # ใช้มันเป็นจุดแบ่งข้อมูลที่เหลือ
        part2_split = re.search(r'(.*?) Address: (.*)', part2, re.DOTALL)

        date_of_birth = part2_split.group(1)
        address = part2_split.group(2)

        return f"{censor_credit_card(credit_card)} {censor_email(email)} {censor_tel(tel)} {censor_DOB(date_of_birth)} {censor_address(address)}"
    except Exception as error:
        return f"Error : {error}"


def censor_credit_card(credit_card):
    # บัตรเครดิตมีรูปแบบ XXXX-XXXX-XXXX-XXXX
    # เราต้องการปิดบังสามกลุ่มแรกและเก็บเฉพาะสี่หลักสุดท้าย

    # ใช้ re.sub(pattern, replacement, string)
    # รูปแบบจะจับกลุ่มเลขสี่หลักสี่กลุ่ม '\d{4}' แปลว่าเลขสี่หลัก
    # ในการแทนที่ เราจะสร้าง 'XXXX-XXXX-XXXX-' แล้วต่อด้วยกลุ่มที่สี่
    # แล้วคืนค่า newFormat
    newFormat = re.sub(r'(\d{4})-(\d{4})-(\d{4})-(\d{4})', r'XXXX-XXXX-XXXX-\4', credit_card)
    return f"{newFormat}"

def censor_tel(tel):
    # เบอร์โทรมีรูปแบบ XXX-XXX-XXXX
    # เราต้องการปิดบังสองกลุ่มแรกและเก็บเฉพาะสี่หลักสุดท้าย

    # ใช้ re.sub(pattern, replacement, string)
    # รูปแบบจะจับสองกลุ่มเลขสามหลักและหนึ่งกลุ่มเลขสี่หลัก
    # '\d{3}' แปลว่าเลขสามหลัก ในการแทนที่เราจะสร้าง 'XXX-XXX-' แล้วต่อด้วยกลุ่มที่สาม
    newFormat = re.sub(r'(\d{3})-(\d{3})-(\d{4})', r'XXX-XXX-\3', tel)
    return f"{newFormat}"

def censor_email(email):
    # ตัวอย่างอีเมล: somchai.d@company.com
    # เราจะเก็บตัวอักษรตัวแรกและตัวสุดท้ายก่อน '@' แล้วปิดบังตัวอักษรตรงกลาง

    # ใช้ re.sub พร้อมฟังก์ชันช่วยเพื่อสร้างสตริงแทนที่
    # รูปแบบจะจับ: ตัวอักษรแรก ตัวอักษรตรงกลาง และตัวอักษรสุดท้ายก่อน '@'
    # '(\w)' หมายถึงตัวอักษรหนึ่งตัว '(.*?)' หมายถึงตัวอักษรใดก็ได้แบบไม่ตะกัก '(?=@)' หยุดที่ '@'
    def mask_email(match):
        # สร้างสตริงที่ปิดบังโดยใช้กลุ่มที่จับได้
        first = match.group(1)
        middle = match.group(2)
        last = match.group(3)
        return first + '*' * len(middle) + last
    
    # ทำการแทนที่และคืนค่าอีเมลที่ปิดบังแล้ว
    newformat = re.sub(r'^(\w)(.*?)(\w)(?=@)', mask_email, email)
    return newformat

def censor_DOB(DOB):
    # วันเดือนปีเกิดมีรูปแบบ: 25/12/2549
    # เราต้องการให้ผลลัพธ์เป็น XX/XX/(สองหลักแรกของปี)XX

    # ใช้ re.sub พร้อมฟังก์ชันช่วย รูปแบบจะจับวัน เดือน และส่วนปี
    # '(\d{1,2})' หมายถึงเลขหนึ่งหรือสองหลัก '(\d{2})' หมายถึงเลขสองหลัก '(\d+)' หมายถึงเลขหนึ่งตัวขึ้นไป
    def mask_DOB(match):
        # ใช้ส่วนปีที่จับได้เพื่อสร้างปีที่ถูกปิดบัง
        third = match.group(3)
        fourth = match.group(4)
        # ปิดบังวันและเดือนด้วย 'XX' เก็บสองหลักแรกของปี แล้วปิดบังส่วนที่เหลือด้วย 'X'
        return f"XX/XX/{third}{len(fourth) * 'X'}"
    
    newFormat = re.sub(r'(\d{1,2})/(\d{1,2})/(\d{2})(\d+)', mask_DOB, DOB)
    # เพิ่มคำนำ 'DOB:' เพราะเราตัดออกก่อนเรียกฟังก์ชันนี้
    return f"DOB:{newFormat}"

def censor_address(address):
    # ที่อยู่มีเลขที่บ้านและรายละเอียดอื่น ๆ สำหรับโจทย์นี้เราจะปิดบังเฉพาะเลขที่บ้าน
    # '(?:/\d+)?' คือกลุ่มที่ไม่จับและเป็นทางเลือก ที่จับ '/ตัวเลข' ได้ถ้ามี
    # ดังนั้นเลขที่บ้านเช่น '34/7' จะถูกจับเป็นหน่วยเดียว

    # เราจะแทนที่ตัวเลขในตำแหน่งเลขที่บ้านตัวแรกด้วย 'X'
    def mask_digits(match):
        # แทนที่ตัวเลขทุกตัวด้วย 'X'
        return re.sub(r'\d', 'X', match.group())
    
    newformat = re.sub(r'\d+(?:/\d+)?', mask_digits, address, count=1)
    # เพิ่มคำนำ 'Address:' เพราะเราตัดออกก่อนเรียกฟังก์ชันนี้
    return f"Address: {newformat}"


if __name__ == "__main__":
    text_log : str = "1234-5678-9012-3456 somchai.d@company.com 093-245-7894 DOB:25/12/2549 Address: 689 ซอยลาดกระบัง 19 ถนนลาดกระบัง แขวงลาดกระบัง เขตลำดกระบัง กรุงเทพฯ"
    result = main(text_log)
    print(result)
